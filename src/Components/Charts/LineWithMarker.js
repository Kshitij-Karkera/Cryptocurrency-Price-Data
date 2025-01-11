import React, { useState, useEffect, useRef } from 'react';
import { scaleTime, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { extent, max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { zoom } from 'd3-zoom';
import { select, pointer } from 'd3-selection';

function LineWithMarker({ theme, data, interval, symbol }) {
    const svgRef = useRef(null);
    const currentXScale = useRef(null);
    const [dimensions] = useState({ width: 800, height: 400 });

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        const svg = select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        let x = scaleTime().domain(extent(data.slice(-50), d => new Date(d[0]))).range([0, width]);
        currentXScale.current = x;

        const currentPrice = parseFloat(data.slice(-1)[0][4]);
        const minPrice = min(data.slice(-50), d => parseFloat(d[3]));
        const maxPrice = max(data.slice(-50), d => parseFloat(d[2]));
        const halfRange = Math.max(currentPrice - minPrice, maxPrice - currentPrice);
        const domainPadding = halfRange * 0.10;

        let y = scaleLinear().domain([currentPrice - halfRange - domainPadding, currentPrice + halfRange + domainPadding]).range([height, 0]);

        const lineGenerator = line()
            .x(d => x(new Date(d[0])))
            .y(d => y(parseFloat(d[4])));

        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height);

        const axesContainer = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        const zoomableContainer = svg.append('g')
            .attr('class', 'zoomableContainer')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr("clip-path", "url(#clip)");

        svg.append('rect')
            .attr('class', 'zoom-rect')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');

        axesContainer.append('g')
            .attr('class', 'grid y')
            .call(axisLeft(y).tickSize(-width).tickFormat(''))
            .attr('color', {theme});
        axesContainer.append('g')
            .attr('transform', `translate(0,${height})`)
            .attr('class', 'grid x')
            .call(axisBottom(x).tickSize(-height).tickFormat(''))
            .attr('color', {theme});
        axesContainer.append('g')
            .attr('transform', `translate(0,${height})`)
            .attr('class', 'x axis')
            .call(axisBottom(x));
        axesContainer.append('g')
            .attr('class', 'y axis')
            .call(axisLeft(y));

        renderChartElements(zoomableContainer, x, y, data, lineGenerator);

        const maxZoomOutFactor = 50 / Math.min(data.length, 1000);

        const zoomBehavior = zoom()
            .scaleExtent([maxZoomOutFactor, 20]) 
            .on('zoom', (event) => {
                const t = event.transform;
                const newX = t.rescaleX(x);
                currentXScale.current = newX;

                const visibleData = data.filter(d => {
                    const date = new Date(d[0]);
                    return date >= newX.domain()[0] && date <= newX.domain()[1];
                });

                const minYValue = min(visibleData, d => parseFloat(d[4]));
                const maxYValue = max(visibleData, d => parseFloat(d[4]));
                const domainRange = maxYValue - minYValue;
                const domainAdjustment = domainRange * 0.05;

                y.domain([minYValue - domainAdjustment, maxYValue + domainAdjustment]);

                zoomableContainer.select('.line-path')
                    .attr("d", lineGenerator.x(d => newX(new Date(d[0]))));

                axesContainer.select('.x.axis').call(axisBottom(newX));
                axesContainer.select('.y.axis').call(axisLeft(y));
                axesContainer.select('.grid.x').call(axisBottom(newX).tickSize(-height).tickFormat(''));
                axesContainer.select('.grid.y').call(axisLeft(y).tickSize(-width).tickFormat(''));

                updateMarkerPositions(zoomableContainer, newX, y);

                const [mx, my] = pointer(event);
                const boundedX = Math.min(Math.max(mx, margin.left), margin.left + width);
                const boundedY = Math.min(Math.max(my, margin.top), margin.top + height);
                crosshairX.attr('transform', `translate(${boundedX},0)`);
                crosshairY.attr('transform', `translate(0,${boundedY})`);

                const dateUnderCrosshair = currentXScale.current.invert(boundedX - margin.left);
                const priceUnderCrosshair = y.invert(boundedY - margin.top);
                priceText.attr('y', boundedY + 5).attr('x', dimensions.width - 5).text(`$${priceUnderCrosshair.toLocaleString('en-US')}`);
                timeText.attr('x', boundedX - 33).text(dateUnderCrosshair.toLocaleDateString());

                const priceTextBBox = priceText.node().getBBox();
                const timeTextBBox = timeText.node().getBBox();

                priceTextBackground
                    .attr('x', priceTextBBox.x - 5)
                    .attr('y', priceTextBBox.y - 2)
                    .attr('width', priceTextBBox.width + 10)
                    .attr('height', priceTextBBox.height + 4);
                timeTextBackground
                    .attr('x', timeTextBBox.x - 5)
                    .attr('y', timeTextBBox.y - 2)
                    .attr('width', timeTextBBox.width + 10)
                    .attr('height', timeTextBBox.height + 4);
            });

        svg.select('.zoom-rect').call(zoomBehavior);

        const crosshairX = svg.append('line')
            .attr('class', 'crosshair-x')
            .attr('stroke', {theme})
            .attr('opacity', '0.5')
            .attr('stroke-dasharray', '5,5')
            .attr('y1', margin.top)
            .attr('y2', margin.top + height)
            .style('display', 'none')
            .attr('pointer-events', 'none');
        const crosshairY = svg.append('line')
            .attr('class', 'crosshair-y')
            .attr('stroke', {theme})
            .attr('opacity', '0.5')
            .attr('stroke-dasharray', '5,5')
            .attr('x1', margin.left)
            .attr('x2', margin.left + width)
            .style('display', 'none')
            .attr('pointer-events', 'none');

        const priceTextBackground = svg.append('rect')
            .attr('class', 'price-text-background')
            .attr('fill', 'black')
            .attr('opacity', 0.7)
            .style('display', 'none')
            .attr('pointer-events', 'none');
        const timeTextBackground = svg.append('rect')
            .attr('class', 'time-text-background')
            .attr('fill', 'black')
            .attr('opacity', 0.7)
            .style('display', 'none')
            .attr('pointer-events', 'none');
        const priceText = svg.append('text')
            .attr('class', 'price-text')
            .attr('x', dimensions.width - 5)
            .attr('y', margin.top)
            .attr('fill', '#fff')
            .attr('text-anchor', 'end')
            .style('display', 'none')
            .attr('pointer-events', 'none');
        const timeText = svg.append('text')
            .attr('class', 'time-text')
            .attr('x', margin.left)
            .attr('y', margin.top - 5)
            .attr('fill', '#fff')
            .style('display', 'none')
            .attr('pointer-events', 'none');

        svg.on('mouseover', function () {
            crosshairX.style('display', null);
            crosshairY.style('display', null);
            priceText.style('display', null);
            timeText.style('display', null);
            priceTextBackground.style('display', null);
            timeTextBackground.style('display', null);
        })
            .on('mouseout', function () {
                crosshairX.style('display', 'none');
                crosshairY.style('display', 'none');
                priceText.style('display', 'none');
                timeText.style('display', 'none');
                priceTextBackground.style('display', 'none');
                timeTextBackground.style('display', 'none');
            })
            .on('mousemove', function (event) {
                const [mx, my] = pointer(event);
                const boundedX = Math.min(Math.max(mx, margin.left), margin.left + width);
                const boundedY = Math.min(Math.max(my, margin.top), margin.top + height);
                crosshairX.attr('transform', `translate(${boundedX},0)`);
                crosshairY.attr('transform', `translate(0,${boundedY})`);

                const dateUnderCrosshair = currentXScale.current.invert(boundedX - margin.left);
                const priceUnderCrosshair = y.invert(boundedY - margin.top);
                priceText.attr('y', boundedY + 5).attr('x', dimensions.width - 5).text(`$${priceUnderCrosshair.toLocaleString('en-US')}`);
                timeText.attr('x', boundedX - 33).text(dateUnderCrosshair.toLocaleDateString());

                const priceTextBBox = priceText.node().getBBox();
                const timeTextBBox = timeText.node().getBBox();

                priceTextBackground
                    .attr('x', priceTextBBox.x - 5)
                    .attr('y', priceTextBBox.y - 2)
                    .attr('width', priceTextBBox.width + 10)
                    .attr('height', priceTextBBox.height + 4);
                timeTextBackground
                    .attr('x', timeTextBBox.x - 5)
                    .attr('y', timeTextBBox.y - 2)
                    .attr('width', timeTextBBox.width + 10)
                    .attr('height', timeTextBBox.height + 4);
            });

    }, [data, dimensions, interval, symbol, theme]);

    function updateMarkerPositions(container, xScale, yScale) {
        container.selectAll(".data-point")
            .attr("cx", d => xScale(new Date(d[0])))
            .attr("cy", d => yScale(parseFloat(d[4])));
    }

    function renderChartElements(container, xScale, yScale, data, lineGenerator) {
        container.selectAll('.line-path').remove();

        container.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#0382bd")
            .attr("stroke-width", 2)
            .attr("class", "line-path")
            .attr("d", lineGenerator);

        container.selectAll(".data-point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(new Date(d[0])))
            .attr("cy", d => yScale(parseFloat(d[4])))
            .attr("r", 4) 
            .attr("fill", "#0382bd"); 
    }

    return <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ cursor: 'crosshair' }}></svg>;
}

export default LineWithMarker;
