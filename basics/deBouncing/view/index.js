const input = document.querySelector("input")

async function getData(agr) {
    console.log(agr)  //will log debouncing as it passed with better function which is get called in input felid on html 
    try {
        // Clear previous results
        const existingItems = document.querySelectorAll("p");
        existingItems.forEach(item => item.remove());  // Remove all existing <p> elements

        if(input.value.length > 0) {
            const response = await fetch(`/getData?search=${input.value}`);
            const data = await response.json();  // Parse the response body as JSON
            
            // Check if there's data to display
            if (data && data.length > 0) {

                data.forEach(item => {
                    const newItem = document.createElement("p");
                    newItem.innerText = item.name;  // Correct method to set text
                    document.body.appendChild(newItem);
                });

            } else {
                const item = document.createElement("p");
                item.innerText = "no matching data";  // Correct method to set text
                document.body.appendChild(item);
            }   
        }else{
            existingItems.forEach(item => item.remove());  // Remove all existing <p> elements
        }
        
        
    } catch (error) {
        console.error("Error fetching data:", error);  // Log any fetch or JSON parsing errors
    }
}



// higher order function that accept another function as an argument
const deBounce = (fun,delay) => {
    let timer
    // ...args means you are accepting the argument passed into the betterFunction()
    return function(...args) {
        clearTimeout(timer)    //clearing the timer if user hit the key before 500ms
        timer = setTimeout(() => {
            fun.apply(this,args)     //this will call the getData() with argument same argument which passed into the betterFunction()
        },delay)
    }
}

const betterFunction = deBounce(getData,500)