const HomePage = () => {
    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <h1 className="text-center mb-4">Welcome</h1>
                <p className="text-center">Go to <strong>/login</strong> or <strong>/dashboard</strong></p>
                <hr />
                <h4 className="text-center">Credentials</h4>
                <ul className="list-group list-group-flush text-center mb-4">
                    <li className="list-group-item"><strong>Email:</strong> ameybhosle3@gmail.com</li>
                    <li className="list-group-item"><strong>Password:</strong> 123456</li>
                </ul>
                <div className="d-flex justify-content-center gap-3">
                    <a href="/login" className="btn btn-primary">Login</a>
                    <a href="/dashboard" className="btn btn-success">Dashboard</a>
                </div>
            </div>
        </div>
    );   
}

export default HomePage;