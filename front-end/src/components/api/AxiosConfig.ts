import axios from 'axios'

/*
Creation d'une instance d'axios avec configuration d'un delais timeout, 
pour eviter qu'axios attende indefiniment, 
si le timeout est depassé, catch error comme habituellement

Importer CETTE instance d'axios et plus 'axios'
*/
const Axios = axios.create({timeout: 5000}) // timeout = 5 secondes

export default Axios;