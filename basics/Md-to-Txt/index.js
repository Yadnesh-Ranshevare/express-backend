import { marked } from "marked";
import fs  from "fs"

// Function to convert a Markdown file to plain text
function convertMDToTXT(mdFilePath, txtFilePath) {
    // Read the markdown file
    fs.readFile(mdFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return;
      }
  
      // Convert markdown to HTML
      const htmlContent = marked(data);
  
      // Strip out HTML tags to get plain text
      const plainText = htmlContent.replace(/<[^>]*>/g, '').trim();
  
      // Write the plain text to a .txt file
      fs.writeFile(txtFilePath, plainText, (err) => {
        if (err) {
          console.error('Error writing the file:', err);
          return;
        }
        console.log('Successfully converted MD to TXT!');
      });
    });
  }

  convertMDToTXT('input.md', 'output.txt');
