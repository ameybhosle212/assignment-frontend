import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import { CircleLoader } from "react-spinners"
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import '../App.css'
import { FaShoppingCart } from 'react-icons/fa';


const Dashboard = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState<any[]>([]);
    const [email, setEmail] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>();
    const [showModal, setShowModal] = useState(false);
    const [cartModal, setCartModal] = useState(false);
    const [orderModal, setOrderModal] = useState(false);
    const [filproducts, setFilproducts] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const allProducts = async () => {
        const token = localStorage.getItem("token")
        if (token !== null && token !== undefined && token.length !== 0) {
            try {
                const { data } = await axios.get("https://api.escuelajs.co/api/v1/products");
                console.log(data)
                setProducts(data)
                setFilproducts(data)
                getAllCategory(data)
            } catch (error) {
                setLoading(false)
                console.log(error)
                toast.error("Some Error Occured")
                navigate("/login")
            }
        }
    }
    const getUserDeTails = async () => {
        const token = localStorage.getItem("token")
        if (token !== null && token !== undefined && token.length !== 0) {
            try {
                const { data } = await axios.post("https://wb0c0wnzll.execute-api.ap-south-1.amazonaws.com/STage", {
                    "route": "dashboard",
                    "token": token
                });
                console.log(data)
                const newData = JSON.parse(data.body);
                if (newData.status === 'ok' && newData.error === null) {
                    console.log(newData)
                    setEmail(newData.data)
                } else {
                    toast.error("Some Error Occured")
                    navigate("/login")
                }
            } catch (error) {
                console.log(error)
                toast.error("Some Error Occured")
                navigate("/login")
            }
        } else {
            navigate("/login")
        }
    }
    console.log(search)
    const getAllCategory = (value: any) => {
        const pset = new Set()
        for (let i = 0; i < value.length; i++) {
            const element = value[i].category.name;
            pset.add(element)
        }
        console.log([...pset])
        setCategory([...pset])
    }
    const getAllDataAccordingToCategory = async (value: string) => {
        if (value === "all") {
            setFilproducts(products);
        } else {
            console.log(value)
            const allCategory = products.filter((vv: any) => vv.category.name === value)
            console.log(allCategory)
            setFilproducts(allCategory)
        }
    }
    const toggleModal = (product: any) => {
        console.log(product)
        setSelectedProduct(product);
        setShowModal(!showModal);
    };
    const addToCart = (product: any) => {
        const ifAlready = cart.find((item: any) => item.id === product.id);
        if (!ifAlready) {
            setCartCount(cartCount + 1);
            const newProduct = { ...product, quantity: 1 }
            const newProductArray = [...cart, newProduct];
            console.log(newProductArray)
            setCart(newProductArray)
        }
        toast.success("Product Added to Cart")
    }
    const removeFromCart = (product: any) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item: any) => item.id !== product.id);
            setCartCount(updatedCart.reduce((count, item) => count + item.quantity, 0));
            return updatedCart;
        });
    };
    const updateQuantity = (productId: number, quantityChange: number) => {
        const updatedCart = cart.map((item: any) => {
            if (item.id === productId) {
                return { ...item, quantity: item.quantity + quantityChange };
            }
            return item;
        }).filter((item: any) => item.quantity > 0);
        setCart(updatedCart);
        setCartCount(updatedCart.length);
    };
    const returnTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return total;
    }
    const checkProductInCart = (productId: number) => {
        return cart.filter((item: any) => item.id === productId).length > 0
    }
    const checkoutInCart = () => {
        const ddd = {
            products: cart,
            dateOfPurchase: new Date().toLocaleDateString(),
            total: returnTotal()
        }
        console.log(ddd);
        
        setOrders([...orders, ddd])
        setCartCount(0)
        setCart([]);
        setCartModal(false)
        toast.success("Order Placed Successfully")

    }
    useEffect(() => {
        const getAllData = async () => {
            setLoading(true)
            await getUserDeTails();
            await allProducts();
            setLoading(false)
        }
        getAllData();
    }, [])
    return (
        <div>
            <ToastContainer />
            {loading ?
                (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                        <CircleLoader color="#4fa94d" />
                    </div>
                ) :
                (
                    <div>
                        {orderModal && (
                            <Modal show={orderModal} onHide={() => setOrderModal(false)} size="lg" centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>{orders.length > 0 ? "All Orders" : "Please Order SOmethings"}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {orders.map((order, index:number) => (
                                        <div key={order.id} className="mb-4 border-bottom pb-3">
                                            <h5>#{index + 1} — Order ID: {index+1}</h5>
                                            <p><strong>Total Price:</strong> ₹{order.total}</p>
                                            <p><strong>Product Count:</strong> {order.products.length}</p>
                                            <p><strong>Date Of Purchase : {order.dateOfPurchase}</strong></p>
                                        </div>
                                    ))}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setOrderModal(false)}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )}
                        {cartModal && (
                            <div
                                className={`modal fade ${cartModal ? 'show' : ''}`}
                                id="cartModal"
                                tabIndex={-1}
                                style={{ display: cartModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                aria-labelledby="cartModalLabel"
                                aria-hidden={!cartModal}
                            >
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="cartModalLabel">
                                                Your Cart
                                            </h5>
                                        </div>

                                        <div className="modal-body">
                                            {cart.length === 0 ? (
                                                <p>Your cart is empty.</p>
                                            ) : (
                                                <ul className="list-group">
                                                    {cart.map((item: any, idx: number) => (
                                                        <li
                                                            className="list-group-item d-flex justify-content-between align-items-center"
                                                            key={idx}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={item.images?.[0]}
                                                                    alt={item.title}
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '60px',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '4px',
                                                                        marginRight: '15px'
                                                                    }}
                                                                />
                                                                <div>
                                                                    <strong>{item.title}</strong><br />
                                                                    <div className="d-flex align-items-center mt-1">
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => updateQuantity(item.id, -1)}
                                                                        >
                                                                            −
                                                                        </button>
                                                                        <span className="mx-2">{item.quantity}</span>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => updateQuantity(item.id, 1)}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="text-right d-flex flex-column align-items-end">
                                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                                <button
                                                                    className="btn btn-sm text-danger mt-2"
                                                                    onClick={() => removeFromCart(item)}
                                                                    title="Remove item"
                                                                >
                                                                    ❌
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>


                                        <div className="modal-footer justify-content-between">
                                            <strong>Total: ${returnTotal()}</strong>
                                            <div>
                                                <button type="button" className="btn btn-secondary mr-2" onClick={() => setCartModal(false)}>
                                                    Close
                                                </button>
                                                {cart.length > 0 && <button type="button" className="btn btn-primary" onClick={() => checkoutInCart()}>
                                                    Checkout
                                                </button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedProduct && (
                            <div
                                className={`modal fade ${showModal ? 'show' : ''}`}
                                id="productModal"
                                tabIndex={-1}
                                style={{ display: showModal ? 'block' : 'none' }}
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">
                                                {selectedProduct.title}
                                            </h5>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div
                                                        id="carouselExampleIndicators"
                                                        className="carousel slide"
                                                        data-ride="carousel"
                                                        data-interval="3000"
                                                    >
                                                        <div className="carousel-inner">
                                                            {selectedProduct.images &&
                                                                selectedProduct.images.map((image: string, idx: number) => (
                                                                    <div
                                                                        className={`carousel-item ${idx === 0 ? 'active' : ''}`}
                                                                        key={idx}
                                                                    >
                                                                        <img src={image} className="d-block w-100" alt={`Slide ${idx + 1}`} />
                                                                    </div>
                                                                ))}
                                                        </div>
                                                        <button
                                                            className="carousel-control-prev"
                                                            type="button"
                                                            data-target="#carouselExampleIndicators"
                                                            data-slide="prev"
                                                        >
                                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                            <span className="sr-only">Previous</span>
                                                        </button>
                                                        <button
                                                            className="carousel-control-next"
                                                            type="button"
                                                            data-target="#carouselExampleIndicators"
                                                            data-slide="next"
                                                        >
                                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                            <span className="sr-only">Next</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <h5>Product Details:</h5>
                                                    <p>{selectedProduct.description}</p>
                                                    <p><strong>Price:</strong> ${selectedProduct.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => toggleModal(selectedProduct)}
                                            >
                                                Close
                                            </button>
                                            {
                                                checkProductInCart(selectedProduct.id) ?
                                                    (
                                                        <button onClick={() => { setShowModal(false); setCartModal(true) }} type="button" className="btn btn-primary">
                                                            View Cart
                                                        </button>
                                                    ) :
                                                    (
                                                        <button onClick={() => addToCart(selectedProduct)} type="button" className="btn btn-primary">
                                                            Add to Cart
                                                        </button>
                                                    )
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Navbar bg="dark" variant="dark" expand="lg">
                            <Container>
                                <Navbar.Brand href="#home">MY SPACE</Navbar.Brand>
                                <Nav className="me-auto">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="category-dropdown">
                                            Categories
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() => getAllDataAccordingToCategory('all')}
                                            >All</Dropdown.Item>
                                            {category && category.map((value, index) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() => getAllDataAccordingToCategory(value)}
                                                    >
                                                        {value}
                                                    </Dropdown.Item>
                                                );
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Nav>
                                <Nav>
                                    <Nav.Link>{email || "user@gmail.com"}</Nav.Link>
                                    <Nav.Link onClick={() => setOrderModal(true)}>My Orders</Nav.Link>
                                    <Nav.Link>My Accounts</Nav.Link>
                                    <Nav.Link onClick={() => setCartModal(!cartModal)}><FaShoppingCart size={22} color="white" />  {cartCount}</Nav.Link>
                                </Nav>
                            </Container>
                        </Navbar>
                        <div className="container mt-5">
                            <h1 className="text-center mb-4">Products</h1>

                            <div className="d-flex justify-content-center mb-5">
                                <form className="d-flex" style={{ width: "400px" }}>
                                    <div className="input-group w-100">
                                        <input
                                            onChange={(e) => {
                                                setSearch(e.target.value)
                                                const filteredProducts = products.filter((item: any) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
                                                setFilproducts(filteredProducts)
                                            }}
                                            type="text"
                                            className="form-control"
                                            placeholder="Search products..."
                                            aria-label="Search"
                                            aria-describedby="search-button"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="row">
                                {filproducts && filproducts.map((items: any, index: number) => {
                                    return (
                                        <div className="col-12 col-sm-6 col-md-3 mb-4" key={index}>
                                            <div className="card h-100">
                                                <img
                                                    src={items.images[0]}
                                                    className="card-img-top"
                                                    alt={items.title}
                                                    style={{ height: '300px', objectFit: 'cover' }}
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{items.title}</h5>
                                                    <p className="card-text text-truncate-multiline">
                                                        {items.description}
                                                    </p>
                                                    <button
                                                        onClick={() => toggleModal(items)}
                                                        className="btn btn-primary mt-auto"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button className="btn btn-secondary mt-3">View More</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Dashboard;