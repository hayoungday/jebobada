import React, {useEffect, useState} from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import axios from 'axios'
// import { ResponsiveBar } from '@nivo/bar'
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, ColumnSeries, Legend, DateTime, Tooltip, DataLabel, LineSeries } from '@syncfusion/ej2-react-charts';



const BullyingScatterPlot = (props) => {

    // const primaryxAxis = { valueType: 'DateTime', title: 'Sales Across Years',labelFormat:"yyMMMdd" }
    // const primaryyAxis = { title: 'Sales Amount in millions(USD)' }

    return(
    <div style={{height:"500px"}}>
        {console.log(props.data)}
       <ChartComponent
          primaryXAxis={{ valueType: 'DateTime', title: 'Sales Across Years',labelFormat:"yyMMMdd" }}
          primaryYAxis={{ title: 'Sales Amount in millions(USD)' }}
          title="Average Sales Comparison"
        >
          <Inject
            services={[
              ColumnSeries,
              Legend,
              Tooltip,
              DataLabel,
              LineSeries,
              DateTime
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={props.data}
              xName="x"
              yName="y"
              name="Sales"
              type="Column"
            ></SeriesDirective>
          </SeriesCollectionDirective>
        </ChartComponent>

        {/* {console.log("hihihihi")}
        {console.log(props)}
    <ResponsiveScatterPlot
        data={[{
            id: "괴롭힘 빈도",
            data: props.data
          },
          ]}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: 'time', min: 'auto', max: 'auto', format: "%Y-%m-%d" }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        yFormat=">-.2f"
        blendMode="multiply"
        nodeSize={8}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: "%b %d",
            tickValues: "every week",
            legend: 'date',
            legendPosition: 'middle',
            legendOffset: 46
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            tickValues: 1,
            legendPosition: 'middle',
            legendOffset: -60
        }}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 126,
                translateY: 0,
                itemWidth: 107,
                itemHeight: 12,
                itemsSpacing: 5,
                itemDirection: 'left-to-right',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    /> */}
    </div>
    )
}

export default BullyingScatterPlot;