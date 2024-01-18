import React from 'react';
import {Typography, Container, Link} from '@mui/material/';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Terms = () => {
  return (
    <Container>
        <Link href="/chat" style={{display: 'flex', alignItems: 'center', marginTop:'1rem', color: '#000', textDecoration:' none'}} >
        <ArrowBackIcon style={{ color: '#000', fontSize: '2rem'}}/> Voltar
        </Link>
      <Typography variant="h5" gutterBottom sx={{marginTop: '3rem'}}>
        Termos de Uso
      </Typography>
      <Typography paragraph>
        1. Ao acessar ao site Ruan Chat, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
      </Typography>
      <Typography paragraph>
        2. Uso de Licença: É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Ruan Chat, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode modificar ou copiar os materiais; usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial); tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Ruan Chat; remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor. Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Ruan Chat a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso.
      </Typography>
      {/* Adicione os parágrafos restantes aqui */}
      <Typography paragraph>
        6. Links: O Ruan Chat não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Ruan Chat do site. O uso de qualquer site vinculado é por conta e risco do usuário.
      </Typography>
      <Typography paragraph>
        Modificações: O Ruan Chat pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
      </Typography>
      <Typography paragraph>
        Lei aplicável: Estes termos e condições são regidos e interpretados de acordo com as leis do Ruan Chat e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
      </Typography>
    </Container>
  );
};

export default Terms;
