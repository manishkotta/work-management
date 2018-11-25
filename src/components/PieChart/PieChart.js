import React, { Component } from 'react';
import './styles.css';
import * as d3 from 'd3'


class PieChart extends Component {

    transformItemsToPieChartData(Items) {
        if (Items.length <= 0) return;
        let activeItems = Items.filter(s => s.workStatus === "Active");

        let inProgressItems = Items.filter(s => s.workStatus === "In Progress");

        let doneItems = Items.filter(s => s.workStatus === "Done");

        let overDueItems = Items.filter(s => s.workStatus === "Overdue");

        let pieChartData = [
            { label: "Active", value: activeItems.length },
            { label: "In Progress", value: inProgressItems.length },
            { label: "Done", value: doneItems.length },
            { label: "Overdue", value: overDueItems.length },
        ];

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
    }

    render() {
        this.transformItemsToPieChartData(this.props.Items);
        return (
            <div id="chart"></div>
        )
    }

}

export default PieChart