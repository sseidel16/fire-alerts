import React from 'react';
import './Header.css';

function Header(props) {
    const {
        user,
        signIn,
        signOut
    } = props;

    return (
        <div className='HeaderContainer'>
            {user ? <img src={user.photoURL} alt='admin account' /> : null}
            {user ? <p>{user.email}</p> : null}
            {user ? <button onClick={signOut}>Sign Out</button> : null}
            {!user ? <button onClick={signIn}>Sign In</button> : null}
        </div>
    );
}

export default Header;