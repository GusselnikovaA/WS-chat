export default {
    render(templateName, model) { 
      const templateElement = document.getElementById(templateName); //script
      const templateSource = templateElement.innerHTML; // html внутри script
      const renderFn = Handlebars.compile(templateSource); // компиляция шаблона
  
      return renderFn(model); // возвращаем готовый html код
    }
  };
  
  // View.render('userInfoTemplate', {name: 'Анна', nick: 'annanac', img: 'img/img.jpeg'})