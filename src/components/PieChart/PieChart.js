import React, { Component } from 'react';
import './styles.css';
import * as d3 from 'd3'


class PieChart extends Component {

    transformItemsToPieChartData(Items){
        console.log(Items)
        if(Items.length <= 0) return;
        let activeItems = Items.filter(s=>{
            if(s.workStatus === "Active")
              return s;
        });

        let inProgressItems = Items.filter(s=>{
            if(s.workStatus === "In Progress")
              return s;
        });

        let doneItems = Items.filter(s=>{
            if(s.workStatus === "Done")
              return s;
        });

        let overDueItems = Items.filter(s=>{
            if(s.workStatus === "Overdue")
              return s;
        });

        let pieChartData = [
            { label:"Active",value: activeItems.length },
            {label:"In Progress",value:inProgressItems.length},
            { label:"Done",value: doneItems.length },
            {label:"Overdue",value:overDueItems.length},
        ];

        var inputData = [{ label: "Category 1", value: 25 }, { label: "Category 2", value: 12 }, { label: "Category 3", value: 35 }, { label: "Category 4", value: 30 }, { label: "Category 5", value: 18 }];

        var colorScheme = ["#E57373", "#BA68C8", "#7986CB", "#A1887F", "#90A4AE", "#AED581", "#9575CD", "#FF8A65", "#4DB6AC", "#FFF176", "#64B5F6", "#00E676"];
        this.renderPieChart(pieChartData, "#chart", colorScheme);
    }

    renderPieChart(dataset, dom_element_to_append_to, colorScheme) {

        d3.select(dom_element_to_append_to).html("");
        var margin = { top: 2, bottom: 2, left: 2, right: 2 };
        var width = 75 - margin.left - margin.right,
            height = 80,
            radius = Math.min(width, height) / 2;
        var donutWidth = 25;
        var legendRectSize = 18;
        var legendSpacing = 4;

        dataset.forEach(function (item) {
            item.enabled = true;
        });

        var color = d3.scale.ordinal()
            .range(colorScheme);

        var svg = d3.select(dom_element_to_append_to)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - donutWidth);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) { return d.value; });

        var tooltip = d3.select(dom_element_to_append_to)
            .append('div')
            .attr('class', 'tooltip');


        tooltip.append('div')
            .attr('class', 'label');

        tooltip.append('div')
            .attr('class', 'count');

        tooltip.append('div')
            .attr('class', 'percent');

        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {
                return color(d.data.label);
            })
            .each(function (d) { this._current = d; });


        path.on('mouseover', function (d) {
            var total = d3.sum(dataset.map(function (d) {
                return (d.enabled) ? d.value : 0;
            }));

            var percent = Math.round(1000 * d.data.value / total) / 10;
            tooltip.select('.label').html(d.data.label.toUpperCase()).style('color', 'black');
            tooltip.select('.count').html(d.data.value);
            tooltip.select('.percent').html(percent + '%');

            tooltip.style('display', 'block');
            tooltip.style('opacity', 2);

        });


        path.on('mousemove', function (d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
        });

        path.on('mouseout', function () {
            tooltip.style('display', 'none');
            tooltip.style('opacity', 0);
        });

       /* var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color)
            .on('click', function (label) {
                var rect = d3.select(this);
                var enabled = true;
                var totalEnabled = d3.sum(dataset.map(function (d) {
                    return (d.enabled) ? 1 : 0;
                }));

                if (rect.attr('class') === 'disabled') {
                    rect.attr('class', '');
                } else {
                    if (totalEnabled < 2) return;
                    rect.attr('class', 'disabled');
                    enabled = false;
                }

                pie.value(function (d) {
                    if (d.label === label) d.enabled = enabled;
                    return (d.enabled) ? d.value : 0;
                });

                path = path.data(pie(dataset));

                path.transition()
                    .duration(750)
                    .attrTween('d', function (d) {
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    });
            });


        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) { return d; }) */
    }

    render() {
        this.transformItemsToPieChartData(this.props.Items);
        return (
            <div id="chart"></div>
        )
    }

}

export default PieChart