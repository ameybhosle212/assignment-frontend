import axios from "axios";
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { CircleLoader } from "react-spinners"

const Login = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const Submit = async (e: any) => {
        setLoading(true)
        e.preventDefault();
        if (email.length === 0) {
            toast.error("Please Enter Username")
        }
        if (password.length === 0) {
            toast.error("Please Enter Password")
        }
        try {
            const { data } = await axios.post("https://wb0c0wnzll.execute-api.ap-south-1.amazonaws.com/STage", {
                "route": "login",
                "data": {
                    "email": email,
                    "password": password
                },
                "token": "value3"
            })
            const newData = JSON.parse(data.body);
            if (newData.status === 'ok' && newData.token.length > 0) {
                // setLoading(false);
                localStorage.setItem("token", newData.token);
                toast.success("Logged SUccessfully")
                // setTimeout(() => {
                    window.location.href = '/dashboard';
                // }, 1500);
            }
            if (newData.status === 'error') {
                setLoading(false);
                toast.error(newData.error)
            }
        } catch (error: any) {
            console.log("error message is", error)
            toast.error("Some Error Occured")
        }
        setLoading(false);
    }
    return (
        <div>
                <ToastContainer />
            {loading ?
            (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} >
                    <CircleLoader  color="#4fa94d" />
                </div >
            ) :
            (
                <div>
                    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                        <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                            <h3 className="text-center mb-4">Login</h3>
                            <form onSubmit={Submit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}


export default Login;