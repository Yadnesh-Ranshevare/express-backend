const but = document.querySelector('button');

but.addEventListener('click', async() => {
    const res = await fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 2 })
    });
    if(res.ok){
        const data = await res.json();
        window.location.href = data.url
        console.log(data);
    }else{
        console.log(res);
    }
    
});