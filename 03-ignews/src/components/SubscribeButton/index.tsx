
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps{
    priceId:string;
}

export function SubscribeButton({priceId}:SubscribeButtonProps){


    const [session] = useSession()
    const router = useRouter()

    async function handleSubscribe(){
        if(!session){
            signIn('github')
            return;
        }

        if( session.activeSubscription){
            router.push('/posts');
            return;
        }
        //criação da checkout session
        try{

            const response = await api.post('/subscribe')
            console.log('response:',response)
            const {sessionId} = response.data;
            console.log('sessionId:',sessionId)
            const stripe = await getStripeJs()
            await stripe.redirectToCheckout({sessionId})
            console.log('response:',response)
            console.log('sessionId:',sessionId)
            console.log('stripe:',stripe)

        }catch(err){
            console.log(err.message)
        }
    }
    
    return(
        <button
        type = "button"
        className = {styles.subscribeButton}
        onClick = { handleSubscribe}>
            Subscribe Now
        </button>
    )
}


