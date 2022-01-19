import React, { useEffect, useState } from 'react';
import List from './List';
import withListLoading from './withListLoading';




export  function ProductList(props) {

    //wrapping List component into a withListLoading so we can see some pre-rendered data during the loading process.
    const ListLoading = withListLoading(List);

    //Update state required for useEffect hook, whenever the value of `update` is changed - the useEffect will be executed
    // we pass this update as a second object in useEffect via [update] syntax
    const [update, setUpdate]=useState(false);

    // State of the component - contains the `products` shown on the page and the `loading` which determins whether to show the component with products or with dummy text.
    const [State, setState] = useState({
      loading: false,
      products: null,
    });


//client-side hook, executed when page is loaded first time and every time [update] variable is changed.
 useEffect( async () => {
     //url to our E-Commerce api
    const apiUrl = `https://habitat-sc.unfrm.uno/uniform/api/content/commerce`;

    //setState to true so the dummy text is shown
    setState({loading:true});


    //execute request
    const resp= await fetch(apiUrl);

    //convert request to json
    const data = await resp.json()
    //output data for debugging
    console.log(data);

    // emulate long response time from server
    await new Promise(resolve => setTimeout(resolve, 10000));

    //once the data is recieved update State property with data and set loading to false, to trigger Component re-render with data from server.
    setState({loading:false, products:data})      
  }, [update]);

  //reload function -> just switches state between true\false
   const reload = ()=> { 
    setUpdate(prev => !prev);
   }

   //jsx code of our component will result in actual HTML
    return (
        <div className='main-container'>
        <div className='container'>
          <h1>My Products</h1>
        </div>
        <div className='product-list-container'>
        {/* Define our ListLoading component which we created on line 11, pass the properties to it so it can process them and render according to the data */}
          <ListLoading isLoading={State.loading} products={State.products} />
        </div>
        <button onClick={()=>reload()}>Reset</button>
      </div>
        
    );
}
