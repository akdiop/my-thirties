import type { LangCourse } from './types';

export const COURSE: LangCourse = {
  script: { title: 'L’alphabet portugais', points: [
    'Même alphabet que le français. Le portugais du Portugal et celui du Brésil s’écrivent presque pareil mais se prononcent différemment ; ce cours suit le Portugal.',
    'Voyelles nasales comme en français, marquées par un tilde (ã, õ) ou suivies de m / n : mãe, pão, bom.',
    'Les voyelles non accentuées sont souvent avalées au Portugal : « telefone » ≈ « tlfonn ».',
    'Accents : aigu (á, é, ó) son ouvert, circonflexe (â, ê, ô) son fermé, grave (à) pour a + a, cédille (ç) = « s ».',
  ], table: [
    ['ão', '« an » nasal + « ou »', 'pão, não'],
    ['ões / ães', '« oïnch », « aïnch »', 'limões, mães'],
    ['lh', '« ly » mouillé', 'filha'],
    ['nh', '« gn »', 'vinho'],
    ['s final ou devant consonne', '« ch »', 'obrigadas, festa'],
    ['s entre voyelles', '« z »', 'casa'],
    ['r / rr', 'r roulé, rr raclé', 'caro, carro'],
    ['o final', '« ou »', 'obrigado'],
    ['e final', 'presque muet', 'leite'],
    ['ç', '« s »', 'praça'],
  ] },
  lessons: [
    { lesson: [
      'Le portugais a des sons nasaux proches du français (an, on), mais aussi des diphtongues nasales : ão (pão), õe (põe).',
      'Le o en fin de mot se dit « ou » : obrigado = « obrigadou ».',
      'Le s final se dit « ch » au Portugal : « dois » = « doïch ».',
      'Écoute et imite : la musique de la phrase compte plus que la perfection des sons.',
    ], vocab: [
      ['olá', 'ola', 'bonjour, salut'], ['sim', 'sinn', 'oui'], ['não', 'nãou', 'non'], ['obrigada', 'obrigada', 'merci (dit par une femme)'],
      ['por favor', 'pour favor', 's’il te plaît'], ['desculpe', 'dchkoulp', 'pardon'], ['água', 'agoua', 'eau'], ['casa', 'kaza', 'maison'],
      ['mulher', 'moulyèr', 'femme'], ['homem', 'omãï', 'homme'], ['pão', 'pãou', 'pain'], ['mãe', 'mãï', 'mère'],
    ], writing: ['Recopie les mots avec ã et õ en prononçant le son nasal.'],
    phrases: [['Olá!', 'ola', 'Salut !'], ['Obrigada.', 'obrigada', 'Merci.'], ['De nada.', 'dé nada', 'De rien.'], ['Não percebo.', 'nãou pèrssébou', 'Je ne comprends pas.'], ['Pode repetir?', 'pod rrépétir', 'Pouvez-vous répéter ?']] },

    { lesson: [
      '« Tu » s’utilise avec les proches ; avec un inconnu on dit « você » ou mieux « a senhora / o senhor », conjugués comme « il/elle ».',
      'Ser (être, identité) : sou, és, é, somos, são. « Sou senegalesa. »',
      'Chamar-se (s’appeler) : chamo-me, chamas-te, chama-se.',
      'Masculin en -o, féminin en -a : obrigado / obrigada selon qui parle.',
      'Morar (habiter) : moro, moras, mora. « Moro em Dakar. »',
    ], vocab: [
      ['bom dia', 'bonn dia', 'bonjour (matin)'], ['boa tarde', 'boa tard', 'bonjour (après-midi)'], ['boa noite', 'boa noït', 'bonsoir'], ['tudo bem?', 'toudou bãï', 'ça va ?'],
      ['bem', 'bãï', 'bien'], ['chamo-me', 'chamou-m', 'je m’appelle'], ['sou', 'so', 'je suis'], ['moro em', 'morou ãï', 'j’habite à'],
      ['trabalho em', 'trabalyou ãï', 'je travaille dans'], ['amiga', 'amiga', 'amie'], ['prazer', 'prazèr', 'enchantée'], ['até logo', 'até logou', 'à plus tard'],
    ], writing: ['Écris ta présentation en 4 phrases.'],
    phrases: [['Chamo-me Aida.', 'chamou-m aïda', 'Je m’appelle Aida.'], ['Sou do Senegal.', 'so dou sénégal', 'Je viens du Sénégal.'], ['Moro em Dakar.', 'morou ãï dakar', 'J’habite à Dakar.'], ['E tu?', 'i tou', 'Et toi ?'], ['Muito prazer.', 'mouïntou prazèr', 'Enchantée.']] },

    { lesson: [
      '1 à 10 : um/uma, dois/duas, três, quatro, cinco, seis, sete, oito, nove, dez.',
      '11 à 20 : onze, doze, treze, catorze, quinze, dezasseis, dezassete, dezoito, dezanove, vinte.',
      'Dizaines : trinta, quarenta, cinquenta, sessenta, setenta, oitenta, noventa, cem. On relie avec e : vinte e um.',
      'L’heure : « É uma hora », « São três horas ». E um quarto (et quart), e meia (et demie).',
      'Prix : « Quanto custa? » — « Custa cinco euros. »',
    ], vocab: [
      ['um, dois, três', 'oum, doïch, trèch', '1, 2, 3'], ['quatro, cinco', 'kouatrou, sinnkou', '4, 5'], ['seis, sete', 'sèïch, sèt', '6, 7'], ['oito, nove, dez', 'oïtou, nov, dèch', '8, 9, 10'],
      ['vinte', 'vinnt', '20'], ['cem', 'sãï', '100'], ['a hora', 'a ora', 'l’heure'], ['o preço', 'ou préssou', 'le prix'],
      ['barato', 'baratou', 'pas cher'], ['caro', 'karou', 'cher'], ['meio-dia', 'mèïou dia', 'midi'], ['meia-noite', 'mèïa noït', 'minuit'],
    ], writing: ['Écris les nombres de 1 à 20 en lettres.'],
    phrases: [['Que horas são?', 'ki orach sãou', 'Quelle heure est-il ?'], ['São dez horas.', 'sãou dèch orach', 'Il est dix heures.'], ['Quanto custa?', 'kouanntou kouchta', 'Combien ça coûte ?'], ['É muito caro.', 'è mouïntou karou', 'C’est très cher.']] },

    { lesson: [
      'Possessifs avec l’article : a minha mãe (ma mère), o meu pai (mon père), os meus irmãos.',
      'Ter (avoir) : tenho, tens, tem, temos, têm. « Tenho duas irmãs. »',
      'Descriptions : « A minha irmã é alta e divertida. » Adjectif après le nom, accordé.',
      'Ser pour ce qui est durable, estar pour l’état : « estou cansada » (je suis fatiguée).',
    ], vocab: [
      ['a mãe', 'a mãï', 'la mère'], ['o pai', 'ou paï', 'le père'], ['a irmã', 'a irmã', 'la sœur'], ['o irmão', 'ou irmãou', 'le frère'],
      ['a filha', 'a filya', 'la fille'], ['o filho', 'ou filyou', 'le fils'], ['a avó', 'a avo', 'la grand-mère'], ['o avô', 'ou avô', 'le grand-père'],
      ['o marido', 'ou maridou', 'le mari'], ['alta', 'alta', 'grande'], ['simpática', 'simmpatica', 'sympathique'], ['engraçada', 'ènngrassada', 'drôle'],
    ], writing: ['Écris ton arbre familial en portugais.'],
    phrases: [['Esta é a minha irmã.', 'èchta è a mignã irmã', 'Voici ma sœur.'], ['Tenho dois irmãos.', 'tagnou doïch irmãouch', 'J’ai deux frères.'], ['A minha mãe é muito simpática.', 'a mignã mãï è mouïntou simmpatica', 'Ma mère est très sympathique.']] },

    { lesson: [
      'Verbes en -ar : falo, falas, fala, falamos, falam. En -er : como, comes, come, comemos, comem. En -ir : parto, partes, parte…',
      'Irréguliers : ir (vou, vais, vai), fazer (faço), ter (tenho), estar (estou).',
      'Réfléchis : levanto-me (je me lève), deito-me (je me couche).',
      'Repères : de manhã (le matin), à tarde, à noite, depois (après), sempre (toujours).',
    ], vocab: [
      ['acordar', 'akourdar', 'se réveiller'], ['tomar o pequeno-almoço', 'toumar ou pkénou-almôssou', 'prendre le petit-déjeuner'], ['trabalhar', 'trabalyar', 'travailler'], ['almoçar', 'almoussar', 'déjeuner'],
      ['jantar', 'jjanntar', 'dîner'], ['beber', 'bbèr', 'boire'], ['ir', 'ir', 'aller'], ['cozinhar', 'kouzignar', 'cuisiner'],
      ['ler', 'lèr', 'lire'], ['dormir', 'dourmir', 'dormir'], ['rezar', 'rrzar', 'prier'], ['depois', 'dpoïch', 'après'],
    ], writing: ['Écris ta routine du matin en 6 phrases.'],
    phrases: [['Acordo às sete.', 'akordou ach sèt', 'Je me réveille à sept heures.'], ['Vou para o trabalho.', 'vo para ou trabalyou', 'Je vais au travail.'], ['À noite leio um pouco.', 'a noït lèïou oum pokou', 'Le soir je lis un peu.']] },

    { lesson: [
      'Demander poliment : « Queria… » (je voudrais), « Pode trazer…? » (pouvez-vous apporter… ?).',
      'Articles : o / a, os / as ; um / uma.',
      'Au restaurant : a ementa (le menu), o prato do dia, a conta (l’addition).',
      'Quantités : um quilo de, meio quilo, uma garrafa de (une bouteille de).',
    ], vocab: [
      ['o frango', 'ou frannggou', 'le poulet'], ['o peixe', 'ou pèïch', 'le poisson'], ['o arroz', 'ou arroch', 'le riz'], ['os legumes', 'ouch lgoumch', 'les légumes'],
      ['a fruta', 'a frouta', 'le fruit'], ['o pão', 'ou pãou', 'le pain'], ['o queijo', 'ou kèïjou', 'le fromage'], ['o sumo', 'ou soumou', 'le jus'],
      ['o café', 'ou kafè', 'le café'], ['a ementa', 'a imènnta', 'le menu'], ['a conta', 'a konnta', 'l’addition'], ['delicioso', 'dlissiozou', 'délicieux'],
    ], writing: ['Écris ta liste de courses en portugais.'],
    phrases: [['Queria um café, por favor.', 'kria oum kafè pour favor', 'Je voudrais un café, s’il vous plaît.'], ['A conta, por favor.', 'a konnta pour favor', 'L’addition, s’il vous plaît.'], ['Está delicioso!', 'chta dlissiozou', 'C’est délicieux !']] },

    { lesson: [
      'Où est… ? « Onde é…? » ou « Onde fica…? ».',
      'Directions : à direita, à esquerda, sempre em frente (tout droit), vire (tournez).',
      'Lieu : perto (près), longe (loin), ao lado de (à côté de), em frente de (en face de).',
      'Transports : de carro, de autocarro (bus), de metro, a pé (à pied).',
    ], vocab: [
      ['a rua', 'a rroua', 'la rue'], ['a estação', 'a chtassãou', 'la gare'], ['o aeroporto', 'ou aéroportou', 'l’aéroport'], ['a praia', 'a praïa', 'la plage'],
      ['a farmácia', 'a farmassia', 'la pharmacie'], ['perto', 'pèrtou', 'près'], ['longe', 'lonnj', 'loin'], ['à direita', 'a dirèïta', 'à droite'],
      ['à esquerda', 'a chkèrda', 'à gauche'], ['em frente', 'ãï frènnt', 'tout droit'], ['o bilhete', 'ou bilyèt', 'le billet'], ['o autocarro', 'ou aoutokarrou', 'le bus'],
    ], writing: ['Écris ton trajet pour aller à un lieu que tu aimes.'],
    phrases: [['Onde fica a estação?', 'onnd fika a chtassãou', 'Où est la gare ?'], ['Vire à direita.', 'vir a dirèïta', 'Tournez à droite.'], ['É longe?', 'è lonnj', 'C’est loin ?']] },

    { lesson: [
      'Le passé (pretérito perfeito) raconte une action finie.',
      '-ar : falei, falaste, falou, falámos, falaram. -er : comi, comeste, comeu, comemos, comeram.',
      'Irréguliers : ir et ser → fui, foste, foi ; fazer → fiz, fez ; ter → tive, teve ; estar → estive.',
      'Repères : ontem (hier), no fim de semana, na semana passada.',
    ], vocab: [
      ['ontem', 'onntãï', 'hier'], ['o fim de semana', 'ou finn dé smana', 'le week-end'], ['fui', 'foui', 'je suis allée'], ['fiz', 'fich', 'j’ai fait'],
      ['comi', 'koumi', 'j’ai mangé'], ['visitei', 'vizitèï', 'j’ai visité'], ['vi', 'vi', 'j’ai vu'], ['gostei', 'gouchtèï', 'ça m’a plu'],
      ['depois', 'dpoïch', 'ensuite'], ['finalmente', 'finalmènnt', 'enfin'],
    ], writing: ['Écris 5 phrases sur ton dernier week-end.'],
    phrases: [['Ontem fui ao mercado.', 'onntãï foui aou mèrkadou', 'Hier je suis allée au marché.'], ['Foi um dia ótimo.', 'foï oum dia otimou', 'C’était une super journée.'], ['O que fizeste no fim de semana?', 'ou ké fizècht nou finn dé smana', 'Qu’as-tu fait ce week-end ?']] },

    { lesson: [
      'Futur proche : ir + infinitif. « Vou viajar. »',
      'Envie : quero (je veux), gostava de / gostaria de (j’aimerais) + infinitif.',
      'Espoir : espero + infinitif.',
      'Repères : amanhã (demain), no próximo ano (l’an prochain), um dia (un jour).',
    ], vocab: [
      ['o projeto', 'ou proujètou', 'le projet'], ['o sonho', 'ou sognou', 'le rêve'], ['viajar', 'viajar', 'voyager'], ['aprender', 'aprènndèr', 'apprendre'],
      ['poupar', 'popar', 'économiser'], ['mudar de casa', 'moudar dé kaza', 'déménager'], ['começar', 'koumssar', 'commencer'], ['amanhã', 'amagnã', 'demain'],
      ['no próximo ano', 'nou prossimou anou', 'l’an prochain'], ['um dia', 'oum dia', 'un jour'],
    ], writing: ['Écris tes 3 projets de l’année.'],
    phrases: [['Vou viajar para o Brasil.', 'vo viajar para ou brazil', 'Je vais voyager au Brésil.'], ['Gostava de aprender a pintar.', 'gouchtava dé aprènndèr a pinntar', 'J’aimerais apprendre à peindre.'], ['Quais são os teus planos?', 'kouaïch sãou ouch téouch planouch', 'Quels sont tes projets ?']] },

    { lesson: [
      'Relancer : E tu? A sério? (vraiment ?), Que bom! (super !).',
      'Demander de l’aide : Como se diz…? O que quer dizer…? Mais devagar (plus lentement).',
      'Donner son avis : acho que (je pense que), para mim, concordo (je suis d’accord).',
    ], vocab: [
      ['a pergunta', 'a pèrgounta', 'la question'], ['a resposta', 'a rrchpochta', 'la réponse'], ['acho que', 'achou ké', 'je pense que'], ['talvez', 'talvéch', 'peut-être'],
      ['também', 'tammbãï', 'aussi'], ['claro', 'klarou', 'bien sûr'], ['mais devagar', 'maïch dvagar', 'plus lentement'], ['adoro', 'adorou', 'j’adore'],
    ], writing: ['Prépare tes 10 questions par écrit.'],
    phrases: [['O que fazes na vida?', 'ou ké fazch na vida', 'Que fais-tu dans la vie ?'], ['Como se diz « joie » em português?', 'komou sé dich … ãï pourtouguéch', 'Comment dit-on « joie » en portugais ?'], ['Mais devagar, por favor.', 'maïch dvagar pour favor', 'Plus lentement, s’il te plaît.'], ['Até breve!', 'até brèv', 'À bientôt !']] },
  ],
};
