const tables = [];
    
    const tableRegex = /<table>(.*?)<\/table>/gs;
    let match;
    
    while ((match = tableRegex.exec(html)) !== null) {
      const tableHTML = match[1];
      const rows = [];
      
      const rowRegex = /<tr>(.*?)<\/tr>/gs;
      let rowMatch;
      
      while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
        const rowHTML = rowMatch[1];
        const cells = [];
        
        const cellRegex = /<(td|th)>(.*?)<\/\1>/gs;
        let cellMatch;
        
        while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
          cells.push(cellMatch[2].trim());
        }
        
        rows.push(cells);
      }
      
      tables.push(rows);
| Item | Description | Quantity | Unit Price (INR) | Total Price (INR) |
|---|---|---|---|---|
| Laptop for Study | Laptop with a minimum of 8GB RAM, 256GB SSD, Intel Core i5 processor, 14-inch display, and a battery life of at least 6 hours.  | 1 | 50,000 | 50,000 |
| Total Budget (INR) |  |  |  | 50,000 | 