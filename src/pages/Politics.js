import React from 'react';
import {Typography, Container, Link} from '@mui/material/';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Politics = () => {
  return (
    <Container>
         <Link href="/chat" style={{display: 'flex', alignItems: 'center', marginTop:'1rem', color: '#000', textDecoration:' none'}} >
        <ArrowBackIcon style={{ color: '#000', fontSize: '2rem'}}/> Voltar
        </Link>
      <Typography variant="h5" gutterBottom sx={{marginTop: '3rem'}}>
        Política de Privacidade
      </Typography>
      <Typography paragraph>
        A sua privacidade é importante para nós. É política do Ruan Chat respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Ruan Chat, e outros sites que possuímos e operamos.
      </Typography>
      <Typography paragraph>
        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
      </Typography>
      {/* Adicione os parágrafos restantes aqui */}
      <Typography paragraph>
        Compromisso do Usuário: O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Ruan Chat oferece no site e com caráter enunciativo, mas não limitativo:
      </Typography>
      <Typography component="ul">
        <li>Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
        <li>Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, kiwibet ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
        <li>Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Ruan Chat, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
      </Typography>
      <Typography paragraph>
        Mais informações: Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site. Esta política é efetiva a partir de 18 January 2024 12:44.
      </Typography>
    </Container>
  );
};

export default Politics;
