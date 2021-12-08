import React, {useEffect, useState} from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import axios from 'axios'
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, ColumnSeries, Legend, DateTime, Tooltip, DataLabel, LineSeries } from '@syncfusion/ej2-react-charts';

const AttackerScatterPlot = (props) => {

    return(
        <div style={{height:"auto"}}>
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
    </div>
    )
}

export default AttackerScatterPlot;