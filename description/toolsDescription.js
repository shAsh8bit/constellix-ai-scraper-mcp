
  export class ToolsDescription {   
    static elementQuery(cssSelector = false) {
      return `
        The Query can be of two type [Natural, Structured] , natural query is a human readable query <Natural Query Example> and structured query is a query in GraphQL like predefined format <Structured Query Example>.
        
        <Natural Query Example>
        - Suppose the user want list of any items from the page, the query can be like this:
          "List all the products on the page"
          for this the tool must return the list of items in Json format.
        </Natural Query Example>
        <Structured Query Example>
        - Suppose the agent wants list of any items from the page, the query can be like this:
          {
        products_list[]{
          product_name,
          product_price,
          product_image,
        }
          } 
        - agent can explicitly specify the data type or define using natural language inside () brackets.
        For example:
          {
        products_list[]{
          product_name (string),
          product_price (number),
          product_image (string),
        }
          } 
          or
          {
        products_list (products made out of cotton)[]{
          product_name,
          product_price,
          product_image,
        }
          }
         - agent may just want a single object of element, in that case the query can be like this:
          {
        form_data{
          form_name,
          form_submit_button,
        }
          } 
          for this the tool must return something like this:
          {
        form_data: {
          form_name: ${cssSelector ? "form#myForm.styledForm[data-form-type='main']" : "//form[@id='myForm' and contains(@class, 'styledForm') and @data-form-type='main']"},
          form_submit_button: ${cssSelector ? "button.submitButton[type='submit']" : "//button[contains(@class, 'submitButton') and @type='submit']"}
        }
          }
        - agent may just want the list of elements, in that case the query can be like this:
          {
        nav_items[]
          }
        </Structured Query Example>
        `.trim();
          }
  
    static dataQuery() {
      return `
  The Query can be of two type [Natural, Structured] , natural query is a human readable query <Natural Query Example> and structured query is a query in GraphQL like predefined format <Structured Query Example>.
  
  <Natural Query Example>
  - Suppose the user want list of any items from the page, the query can be like this:
    "List all the products on the page"
    for this the tool must return the list of items in Json format.
  </Natural Query Example>
  
  <Structured Query Example>
  - Suppose the agent want list of any items from the page, the query can be like this:
    {
      products_list[]{
        product_name,
        product_price,
        product_image,
      }
    }
    for this the agent must return the list of items in the same Json format as the query.
  Like this: 
    {
      products_list: [
        {
          product_name: "Product 1",
          product_price: "$10",
          product_image: "image1.jpg"
        },
        {
          product_name: "Product 2",
          product_price: "$20",
          product_image: "image2.jpg"
        }
      ]
    }
  - the agent can explicitly specify the data type or define using natural language inside () brackets.
  For example:
    {
      products_list[]{
        product_name (string),
        product_price (number),
        product_image (string),
      }
    }
    or
    {
      products_list (products made out of cotton)[]{
        product_name,
        product_price,
        product_image,
      }
    }
    - the agent may just want the list of elements, in that case the query can be like this:
    {
      nav_items[]
    }
  </Structured Query Example>
  </Data_Extraction_rules>
  `.trim();
    }
  }