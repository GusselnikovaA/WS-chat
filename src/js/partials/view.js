export default {
    render(templateName, model) { //userInfo
      templateName = templateName + 'Template'; //userInfoTemplate
  
      const templateElement = document.getElementById(templateName);
      const templateSource = templateElement.innerHTML;
      const renderFn = Handlebars.compile(templateSource);
  
      return renderFn(model);
    }
  };
  
  // view.render('header', {first_name: 'Анна'})