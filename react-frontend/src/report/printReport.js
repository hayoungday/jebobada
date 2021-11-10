import ReactToPrint from 'react-to-print'
import React, {useRef} from 'react'
import Analysis from '../components/Analysis';


const PrintReport = () => {
    
    const componentRef = useRef();

    return (
    <div>
        <ReactToPrint
        trigger={() => <button>Print this out!!</button>}
        content={() => componentRef.current}
        />
        <Analysis ref={componentRef} />
    </div>
    );
    
  }
  
  export default PrintReport;