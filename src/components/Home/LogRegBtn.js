import { Link } from "react-router-dom";
import "./LogRegBtn.css";
function LogRegBtn({isLoggedIn}){
    if (isLoggedIn) return null;
    return(
        <div>
            
            <div className="auth-buttons">
            <Link to="/register" >
                <div className="auth-button">
               新規会員登録

                </div>
                </Link>
                <Link to="/login" >
                <div className="auth-button">
                ログイン

                </div>
                </Link>
            </div>
         
        </div>
        );

}


export default LogRegBtn;
