import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';

function Addview(){

    let [user , setuser] = useState({});
    let [data , setdata] = useState([]);
    let [iddata,setiddata] = useState(0);
    let [search, setsearch] = useState('');

    let [prorecord, setprorecord] = useState([]);
    let [pageno, setpageno] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [PerPage , setPerPage] = useState(5);

    let [usererr , setusererr] = useState('');

    useEffect(()=>{
        getdata();
    })

    let getinput=(e)=>{
        let name = e.target.name;
        let value = e.target.value;

        if(name == "username")
            {
                if(value == "")
                {
                    setusererr({...usererr,["username"]:"username is required"});
                }
                else if(value.length<=3)
                {
                    setusererr({...usererr,["username"]:"username is 2 or more character required"});
                }
                else 
                {
                    setusererr({...usererr,["username"]:""})
                }
            }
            else if(name == "email")
            {
                if(value == "")
                {
                    setusererr({...usererr,["email"]:"email is required"});
                }
                else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)))
                {
                    setusererr({...usererr,["email"]:"enter valid email"});
                }
                else 
                {
                    setusererr({...usererr,["email"]:""})
                }
            }
            else if(name=="phone")
            {
                if(value=="")
                {
                    setusererr({...usererr,["phone"]:"mobile number is required"})
                }
                else if(value.length!=10)
                {
                    setusererr({...usererr,["phone"]:"only number allowed && please 10 digit allow"})
                }
                else{
                    setusererr({...usererr,["phone"]:""})
                }
            } 
            else if(name == "image")
            {
                if(value != "")
                {
                    setusererr({...usererr,["image"]:""});
                }
            }
                setuser({...user , [name]:value});
            
    }

    let getdata=()=>{
        axios.get("http://localhost:3000/users")
        .then((res)=>{
            setdata(res.data);
            const LastRecord = currentPage * PerPage;
            const FirstRecord = LastRecord - PerPage;
            const currentRecords = res.data.slice(FirstRecord, LastRecord);
            setprorecord(currentRecords);

            const no = Math.ceil(res.data.length /PerPage)
            var pages = [];
            for(let i=1 ; i<=no ; i++) 
            {
                pages.push(i);
            }
            setpageno(pages);
        })
        .catch((err)=>{
            console.log("err");
        })
    }

    let submitdata=(e)=>{
        e.preventDefault();

        if(e.target.username.value =="")
        {
            setusererr({...usererr,["username"]:"username is required"});
        }
        else if(e.target.username.value.length<=3)
        {
            setusererr({...usererr,["username"]:"username is 2 or more character required"});
        }
        else if(e.target.email.value == "")
        {
            setusererr({...usererr,["email"]:"email is required"});
        }
        else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.email.value)))
        {
            setusererr({...usererr,["email"]:"enter valid email"});
        }
        else if(e.target.phone.value =="")
        {
            setusererr({...usererr,["phone"]:"mobile number is required"})
        }
        else if(e.target.phone.value.length!=10)
        {
            setusererr({...usererr,["phone"]:"onlu number allowed && please 10 digit allow"})
        }
        else if(e.target.image.value =="")
        {
            setusererr({...usererr,["image"]:"upload image"})
        }
        else{

            setusererr({...usererr,["username"]:""});
            setusererr({...usererr,["email"]:""});
            setusererr({...usererr,["phone"]:""});
            setusererr({...usererr,["image"]:""});

            axios.get("http://localhost:3000/users/?email="+user.email)
            .then((res)=>{
                if(res.data.length==0)
                {
                    if(iddata==0)
                    {
                        axios.post("http://localhost:3000/users",user)
                        .then((res)=>{
                            console.log(res.data);
                            setuser({});
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    }
                    else{
                        axios.put("http://localhost:3000/users/"+iddata , user)
                        .then((res)=>{
                            console.log(res.data);
                            getdata();
                            setiddata(0)
                            setuser({});
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    }
                }
                else{
                    alert("userdata alerdy exist")
                }
            })
            
        }
        getdata();
        setuser({});
        e.target.image.value="";
    }

    let deletedata=(id)=>{
        axios.delete("http://localhost:3000/users/"+id ,user)
        .then((res)=>{
            console.log(res.data);
            getdata();
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    let Updatedata=(id)=>{
        axios.get("http://localhost:3000/users/"+id , user)
        .then((res)=>{
            setuser(res.data);
            setiddata(id);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    let searching = (e) => {
        setsearch(e.target.value)
    }

    let selectno=(pagen)=>{
        setCurrentPage(pagen);
        const LastRecord = pagen * PerPage;
        const FirstRecord = LastRecord - PerPage;
        const currentRecords = data.slice(FirstRecord, LastRecord);
        setprorecord(currentRecords);
    }

    return(
        <Container>
            <Row className="justify-content-md-center mt-5" >
                <Col xs lg="6" style={{border:"2px solid" , padding:"20px"}}>
                <h1 style={{textAlign:"center"}}>CRUD Operation</h1>
                <Form method="post" onSubmit={(e)=>submitdata(e)}>
                    <Form.Group as={Row} className="mb-3 mt-5" controlId="formPlaintextUsername">
                        <Form.Label column sm="2">
                            Username
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type='text' placeholder="Enter Username" name="username" value={user.username?user.username:""}  onChange={(e)=>getinput(e)}/>
                            <span style={{color:"red"}}>{usererr.username?usererr.username:""}</span>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            Email
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type='email' placeholder="Enter Email" name="email" value={user.email?user.email:""}  onChange={(e)=>getinput(e)}/>
                            <span style={{color:"red"}}>{usererr.email?usererr.email:""}</span>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPhone">
                        <Form.Label column sm="2">
                            Phone
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="phone" placeholder="Enter Mobile No."  name="phone" value={user.phone?user.phone:""}  onChange={(e)=>getinput(e)}/>
                            <span style={{color:"red"}}>{usererr.phone?usererr.phone:""}</span>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextcPassword">
                        <Form.Label column sm="2">
                            Image
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" placeholder="Enter Image Link" name="image" value={user.image?user.image:"} onChange={(e)=>getinput(e)}/>
                            <span style={{color:"red"}}>{usererr.image?usererr.image:""}</span>
                        </Col>
                    </Form.Group>
                    <input type='submit' value={iddata==0?"Submit":"Update"} name="submit" style={{backgroundColor:"black" ,border:"0" , color:"white" , padding:"10px 15px"  ,margin:"0 280px"}} />
                    </Form>
                </Col>
                
                        <div style={{marginTop:"30px"}}>
                            
                                <Form.Control type="text" placeholder="Search" className=" mr-sm-2" onChange={(e) => searching(e)} />
                               <br/>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th>User Name</th>
                                        <th>email</th>
                                        <th>Phone</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prorecord.filter((v1, i1) => {
                                        if (v1.username.match(search)) {
                                            return v1
                                        }
                                        else if(v1.email.match(search)){
                                            return v1
                                        }
                                        else if(v1.phone.match(search)){
                                            return v1
                                        }
                                    }).map((v,i)=>{
                                    return(
                                        <tr>
                                            <td>{++i}</td>
                                            <td>{v.image ? <img src={v.image} height={100}/> : "" }</td>
                                            <td>{v.username}</td>
                                            <td>{v.email}</td>
                                            <td>{v.phone}</td>
                                            <td><button style={{backgroundColor:"green" , color:"white", border:"none"}} onClick={()=>Updatedata(v.id)}>Edit</button> || <button style={{backgroundColor:"red" , border:"none"}} onClick={()=>deletedata(v.id)}>Delete</button></td>
                                            
                                        </tr>
                                     )
                                })}
                                </tbody>    
                            </Table>
                        </div>
                                    <Col>
                                        <Pagination>
                                            <div style={{margin:"0 auto", display:"flex" , marginTop:"30px"}}>
                                                {pageno.map((v,i)=>{
                                                    return(
                                                        <Pagination.Item key={v} active={v} onClick={()=>selectno(v)}>{v}</Pagination.Item>
                                                    )
                                                })}
                                            </div>
                                        </Pagination>
                                    </Col>
            </Row>
        </Container>
    )
}

export default Addview;
