# Análise de Aquecimento de Motores

Este projeto apresenta uma análise interativa da performance de aquecedores de motores UG#06, UG#19 e UG#20, com visualização de dados em tempo real e cálculos de consumo de energia.

## Características

- **Gráfico Interativo**: Visualização das curvas de temperatura dos três motores com tooltips informativos
- **Funcionalidade de Zoom**: Clique e arraste para fazer zoom em áreas específicas do gráfico, use a roda do mouse para zoom rápido
- **Linha de Referência**: Marcação da temperatura mínima para partida (50.1°C)
- **Cálculos de Energia**: Análise automática da média total de consumo energético durante todo o período
- **Design Responsivo**: Layout moderno compatível com desktop e mobile
- **Linhas Finas**: Visualização mais limpa com linhas de espessura otimizada
- **Tooltip Unificado**: Mostra valores dos três motores simultaneamente ao passar o mouse

## Tecnologias Utilizadas

- HTML5
- CSS3 com design moderno e gradientes
- JavaScript ES6+
- Chart.js para visualização de dados
- Chart.js Zoom Plugin para funcionalidade de zoom interativo
- Design responsivo com CSS Grid e Flexbox

## Estrutura do Projeto

```
motor-heating-site/
├── index.html          # Página principal
├── style.css           # Estilos CSS
├── script.js           # Lógica JavaScript
├── data.csv            # Dados de temperatura dos motores
└── README.md           # Este arquivo
```

## Como Publicar no GitHub Pages

### Passo 1: Criar Repositório no GitHub
1. Acesse [GitHub](https://github.com) e faça login
2. Clique em "New repository"
3. Nomeie o repositório (ex: `motor-heating-analysis`)
4. Marque como "Public"
5. Clique em "Create repository"

### Passo 2: Fazer Upload dos Arquivos
1. Na página do repositório, clique em "uploading an existing file"
2. Arraste e solte todos os arquivos do projeto:
   - `index.html`
   - `style.css`
   - `script.js`
   - `data.csv`
   - `README.md`
3. Adicione uma mensagem de commit (ex: "Adicionar site de análise de motores")
4. Clique em "Commit changes"

### Passo 3: Ativar GitHub Pages
1. No repositório, vá para "Settings" (Configurações)
2. Role para baixo até a seção "Pages"
3. Em "Source", selecione "Deploy from a branch"
4. Escolha "main" como branch
5. Deixe "/ (root)" como pasta
6. Clique em "Save"

### Passo 4: Acessar o Site
- Aguarde alguns minutos para o deploy
- O site estará disponível em: `https://[seu-usuario].github.io/[nome-do-repositorio]`
- Exemplo: `https://joaosilva.github.io/motor-heating-analysis`

## Funcionalidades do Site

### Gráfico Principal
- **Eixo X**: Tempo (HH:MM:SS) desde o início do teste
- **Eixo Y**: Temperatura (°C) de 20°C a 90°C
- **Curvas**:
  - Azul: Aquecimento UG#06
  - Amarelo: Aquecimento UG#19
  - Verde: Aquecimento UG#20
- **Linha Tracejada Laranja**: Temperatura mínima para partida (50.1°C)
- **Zoom Interativo**: 
  - Clique e arraste para selecionar área de zoom
  - Use a roda do mouse para zoom rápido
  - Clique duplo para resetar o zoom

### Tooltips Interativos
Ao passar o mouse sobre o gráfico, são exibidas informações:
- Tempo atual
- Temperatura de todos os três motores simultaneamente
- Tempo de aquecimento desde o início

### Cartões de Informação
Cada motor possui um cartão com:
- Especificações técnicas (circuito, corrente, potência)
- Média total de consumo durante todo o período de análise

## Especificações dos Motores

### Motor #06 e #19
- **Circuito**: Trifásico
- **Tensão**: 480V
- **Corrente por fase**: 26,1 A
- **Potência 1 estágio**: 13,5 kW
- **Potência 2 estágios**: 27 kW

### Motor #20
- **Circuito**: Bifásico
- **Tensão**: 480V
- **Corrente por fase**: 45,2 A
- **Potência 1 estágio**: 18 kW
- **Potência 2 estágios**: 36 kW

## Suporte

Para dúvidas ou problemas, verifique se:
1. Todos os arquivos foram enviados corretamente
2. O GitHub Pages está ativado nas configurações
3. O navegador suporta JavaScript (necessário para o gráfico)

## Licença

Este projeto é de uso livre para fins educacionais e de análise técnica.

