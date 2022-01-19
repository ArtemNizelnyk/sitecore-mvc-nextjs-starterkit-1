import React, { useState, useEffect } from 'react';
import styles from '../../styles/ProductCard.module.css';
import Cookies from 'js-cookie';

const List = (props) => {

    //props will contain everything passed from the parent component - we need only products from their.
    const { products } = props;

    if (!products || products.length === 0) return <p>No products, sorry</p>;


    //set a User on initial page rendering. check cookie or set null
    const [User, setUser] = useState(
        Cookies.get('CommerceEmail')||null
    );

    // initialize cart as an empty object
    const [cart, setCart] = useState(
       []
       
    );

    //initialize email as an String.empty
    const [Email, setEmail] = useState("");


    //Update cart with data from server -> load cart from server and set it as a `cart` state variable
    // due to  [] second parameter - hook is invoked only on first render.
    useEffect( async () => {
        const apiUrl = "https://habitat-sc.unfrm.uno/uniform/api/content/commerce/GetOrCreateUserCart/"+User;

        fetch(apiUrl)
        .then(res=>res.json())
        .then(data=> setCart([...data.LineItems]))
    }, [])


// api responsible for sending a request to E-Commerce to add a product to a cart.
// we pass (el) as a parameter so we can identify which exactly product we are adding.
    const AddApi = (el) => {
        const apiUrl="https://habitat-sc.unfrm.uno/uniform/api/content/commerce/AddToCart/"+User+"/"+el.id;

        fetch(apiUrl)
        .then(res => res.json())
        .catch(error=> console.log(error))

    }

// api responsible for sending a request to E-Commerce to remove a product from a cart.
// we pass (el) as a parameter so we can identify which exactly product we are removing.
    const removeApi = (el)=> {
        const apiUrl="https://habitat-sc.unfrm.uno/uniform/api/content/commerce/RemoveFromCart/"+User+"/"+el.id;

        // fetch(apiUrl)
        // .then(res => res.json())
        // .catch(error=> console.log(error))
    }

    //method which we assign to an Add button
    const addToCart = (el) => {

        //call api
        AddApi(el);

        //update cart on a page (React object state)
        setCart([...cart, el]);

    };

  //method which we assign to a Remove button
    const subsctruct = (el) => {

        let updateArray= [...cart]
        let index = updateArray.indexOf(el);
        if (index > -1) {
            updateArray.splice(index, 1);
            //call Api
            removeApi(el)
        }
        
        if(updateArray.length<1)
        {
            updateArray=[];
        }

        //update cart on a page (React object state)
        setCart([...updateArray]);

    };


//when u are not authenticated this listens to input box and sets the input into the Email state. 
    const   handleChange = (event) =>{
        setEmail(event.target.value);
      }

      //use the value from Email state when form is submited.
    const handleSubmit = (event) => {
        //update User state
        setUser(Email);

        //set cookie
        Cookies.set("CommerceEmail", Email);
    }


    //if user is not authenticated, show authentication form
    if(!User)
    {
        return (<div>
            <p style={{ textAlign: 'center', fontSize: '30px' }}>
              Please authenticate so we can retrieve your cart.
            </p>
            <form onSubmit={handleSubmit}>
            <label>
              Email :
              <input type="text" name="email" onChange={handleChange}/>
            </label>
            <input type="submit" value="Submit" />
          </form>
          </div>
          );
    }

    return (
        <div>
            Hello {User}

            <p>Items in Cart:{cart.length}</p>
            <ul className={styles.card}>
                <h2 className="list-head">Available products</h2>
                {products.map((products) => {
                    return (<li >
                        <div key={products.id} >
                            <div className={styles}>
                                <img src={products.image} height={300} width={220} />
                                <h4 className={styles.title}>{products.product}</h4>
                                <h5 className={styles.category}>{products.category}</h5>
                                <p>$ {products.price}</p>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => addToCart(products)}
                                >
                                    +1
                                </button>

                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => subsctruct(products)}
                                    disabled={cart.length <1}
                                >
                                    -1
                                </button>
                            </div>
                        </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
export default List;
