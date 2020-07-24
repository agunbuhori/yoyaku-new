export default function({ $auth, store, redirect }) {  
    if (! $auth.loggedIn) {
      return redirect('/login')
    }
}
