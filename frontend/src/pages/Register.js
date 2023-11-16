import React, {useState} from 'react';
import BasicInfo from '../Forms/BasicInfo';
import CardInfo from '../Forms/CardInfo';

const RegisterForm = () => {
    const [basicData, setBasicData] = useState({});
    const [basicDataRender, setbasicDataRender] = useState(true)
    const [cardInfoRender, setcardInfoRender] = useState(false);

    function save (data) {
        localStorage.setItem("oldData", JSON.stringify(data ));
        console.log("Save");
    }
   console.log(JSON.parse(localStorage.getItem("oldData")));
    const getBasicInfoDataHandler = ( data ) => {
        setBasicData(data)
        setbasicDataRender(false)
        setcardInfoRender(true)
        save(data);
    }
    
    const prevHandler = () => {
        setbasicDataRender(true)
        setcardInfoRender(false)
    }

    
    return (
        <div>
            {basicDataRender && <BasicInfo getData={getBasicInfoDataHandler} oldData={basicData}></BasicInfo>}
            {cardInfoRender && <CardInfo prev={prevHandler} basicInfo={basicData}></CardInfo>}
            
        </div>
    )
}
 
export default RegisterForm;