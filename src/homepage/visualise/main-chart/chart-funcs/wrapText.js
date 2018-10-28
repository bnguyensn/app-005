import {select} from 'd3-selection';

/**
 * Created by Mike Bostock https://bl.ocks.org/mbostock/7555321
 * */
export default function wrapText(text, width) {
    text.each(function w() {
        const t = select(this);

        const words = t.text().split(/\s+/).reverse();

        let line = [];
        let lineNumber = 0;

        const lineHeight = 1.1; // ems
        const y = t.attr('y');
        const dy = parseFloat(y || 0);
        let tspan = t.text(null)
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', `${dy}em`);

        let word = words.pop();
        while (word) {
            line.push(word);
            tspan.text(line.join(' '));

            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                lineNumber += 1;
                tspan = t.append('tspan')
                    .attr('x', 0)
                    .attr('y', y)
                    .attr('dy', `${lineNumber * lineHeight + dy}em`)
                    .text(word);
            }

            word = words.pop();
        }
    });
}
