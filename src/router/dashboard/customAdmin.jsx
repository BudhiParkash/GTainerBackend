import React, {useEffect, useState} from 'react'
import {Line} from 'react-chartjs-2';
import Axios from 'axios';

const Dashboard = (props) => {

  var data = [0,0,0,0,0,0,0,0,0,0,0,0]
  const [passData, setPassData] = useState([]);
  const [passData1, setPassData1] = useState([]);
  const [passData2, setPassData2] = useState([]);
  const [hospitalId, setHospitalId] = useState("");
  const [file, setFile] = useState(null);

  const currentYear = new Date();
  useEffect(()=>{
    Axios.get('https://userlist',{
      headers:{
        "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjA4MWNjYTg4YzkwOTY3ZmE3OGFlMTgiLCJpYXQiOjE2MDE4NzY4MzB9.t19KKGM_dqxoCYspVHCUcq5N1Pp2iEXWYUx7qiOIfTk"
      }
    })
    .then(res => {
      for(var i =0; i<res.data.length;i++){
        const fullDate = res.data[i].createdAt.split("T")[0]
        const date = new Date(fullDate)
        if(currentYear.getFullYear() === date.getFullYear()){
          switch(date.getMonth()+1){
            case 1:
              data[0] += 1
              break
            case 2:
              data[1] += 1
              break
            case 3:
              data[2] += 1
              break
            case 4:
              data[3] += 1
              break
            case 5:
              data[4] += 1
              break  
            case 6:
              data[5] += 1
              break
            case 7:
              data[6] += 1
              break
            case 8:
              data[7] += 1
              break
            case 9:
              data[8] += 1
              break
            case 10:
              data[9] += 1
              break
            case 11:
              data[10] += 1
              break
            case 12:
              data[11] += 1
              break
        }
      }
    }
    var data1 = new Array(new Date(currentYear.getFullYear(), currentYear.getMonth()+1, 0).getDate()).fill(0)
    res.data.forEach((item)=>{
      if(parseInt(item.createdAt.split("T")[0].split("-")[1]) === (currentYear.getMonth()+1 < 10 ? "0"+(currentYear.getMonth()+1):currentYear.getMonth()+1)){
          data1[parseInt(item.createdAt.split("T")[0].split("-")[2])-1] += 1
      }
    })
    setPassData1(data1)
    setPassData(data)})
    Axios.get("https://",{
      headers:{
        "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjA4MWNjYTg4YzkwOTY3ZmE3OGFlMTgiLCJpYXQiOjE2MDE4NzY4MzB9.t19KKGM_dqxoCYspVHCUcq5N1Pp2iEXWYUx7qiOIfTk"
      }
    })
    .then(res => {
      var data2 = new Array(new Date(currentYear.getFullYear(), currentYear.getMonth()+1, 0).getDate()).fill(0)
      res.data.forEach((item)=>{
        if(parseInt(item.createdAt.split("T")[0].split("-")[1]) === (currentYear.getMonth()+1 < 10 ? "0"+(currentYear.getMonth()+1):currentYear.getMonth()+1)){
            data2[parseInt(item.createdAt.split("T")[0].split("-")[2])-1] += 1
        }
      })  
    setPassData2(data2)})
  },[])

  const graphDataYear = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'Number Of Registered Users Of This Year',
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      data: passData
    }
  ]
};

  const getAllDates = () => {
    var labelsForMonth = []
    for(var i = 0; i<new Date(currentYear.getFullYear(), currentYear.getMonth()+1, 0).getDate();i++){
        labelsForMonth.push("Day"+String(i+1))
    }
    return labelsForMonth
  }
  const graphDataMonth = {
    labels: getAllDates(),
    datasets: [
      {
        label: 'Number Of Registered Users Of This Month',
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: passData1
      }
    ]
  };


  const uploadPictureForm = () => {
    var hospiForm = document.getElementById("hospiForm");
    if(hospiForm.style.display === "none"){
        hospiForm.style.display = "flex";
    }else{
        hospiForm.style.display = "none";
    }
  }

  const upload = (event) => {
    event.preventDefault();
    var formData = new FormData();
    formData.append('avatar', file)
    Axios.post(`https://`,formData,{
      headers:{
          "Content-Type":"multipart/form-data",
          "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjA4MWNjYTg4YzkwOTY3ZmE3OGFlMTgiLCJpYXQiOjE2MDE4NzY4MzB9.t19KKGM_dqxoCYspVHCUcq5N1Pp2iEXWYUx7qiOIfTk"
      }
    })
    .then(res => uploadPictureForm())
  }

  return (
    <React.Fragment>
      <div className="buttons" style={{margin:"30px"}}>
        <span style={{background:"#4268f6",color:"white",width:"200px",textAlign:"center",padding:"10px 20px",fontSize:"17px",cursor:"pointer"}} onClick={()=>uploadPictureForm()}>Upload Hospital's Photo</span>
      </div>
      <div className="" style={{position:"fixed", width:"100%", height:"100%", background:"#4268f6", display:"none", justifyContent:"center"}} id="hospiForm">
          <h1 style={{color:"white",position:"fixed",top:"5px",right:"17px", fontSize:"28px", cursor:"pointer"}} onClick={()=>uploadPictureForm()}>&#10539;</h1>
          <form style={{transform:"translate(-25%)", background:"white", marginTop:"100px", width:"40%", height:"210px"}} onSubmit={()=>upload(event,hospitalId)}>
            <input type="text" style={{marginTop:"30px", marginLeft:"20px", border:"0", borderBottom:"1px solid black", width:"70%", padding:"10px"}} placeholder="Enter Hospital Id" value={hospitalId} onChange={(e)=>setHospitalId(e.target.value)} />
            <br></br>
            <input type="file" style={{marginTop:"30px", marginLeft:"20px"}} accept="image/*" onChange={(e)=>setFile(e.target.files[0])}/>
            <br></br>
            <input type="submit" style={{background:"#4268f6",color:"white",width:"150px",textAlign:"center",padding:"9px 14px",fontSize:"15px", margin:"20px", marginTop:"30px", border:"0", cursor:"pointer"}} value="Upload" />
          </form>
      </div>
      <div  style={{width:"90%",marginTop:"60px",marginLeft:"20px",marginBottom:"60px"}}>
        <h1 style={{textAlign:"center",textDecoration:"underline"}}>Registered Users Of This Year</h1>
        <Line data={graphDataYear} />
      </div>
      <div style={{width:"90%",marginTop:"60px",marginLeft:"20px",marginBottom:"60px"}}>
        <h1 style={{textAlign:"center",textDecoration:"underline"}}>Registered Users Of This Month</h1>
        <Line data={graphDataMonth} />
      </div>
    </React.Fragment>
  )
}

export default Dashboard