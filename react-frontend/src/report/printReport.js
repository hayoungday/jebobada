import ReactToPrint from 'react-to-print'
import React, {useRef} from 'react'
import Analysis from '../components/Analysis';
import Overview from './Overview';


const PrintReport = () => {
    
    const componentRef = useRef();

    return (
    <div>
        
        <ReactToPrint
        trigger={() => <button>Print this out!!</button>}
        content={() => componentRef.current}
        />
        
    </div>
    );
    
  }
  
  export default PrintReport;