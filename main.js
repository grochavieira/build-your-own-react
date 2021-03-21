// substitui a função React.createElement
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // todo elemento que não é um objeto é transformado
      // em um objeto, como texto e número
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// função para criar um objeto a partir de um texto
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// função para criar nós na DOM
function render(element, container) {
  // cria o elemento, podendo ele ser um elemento
  // que existe no HTML ou seu próprio elemento
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // adiciona as propriedas (props) ao nó
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  // recursivamente faz o mesmo para todos os filhos
  element.props.children.forEach((child) => render(child, dom));

  // adiciona o elemento no container
  container.appendChild(dom);
}

// Didact substitui a biblioteca React
const Didact = {
  createElement,
  render,
};

// o comentário abaixo serve para o babel
// utilizar nossa função quando transpilar o jsx
/** @jsx Didact.createElement */
const element = (
  <div className="foo">
    <a>bar</a>
    <b />
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
