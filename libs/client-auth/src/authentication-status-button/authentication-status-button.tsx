import { RenderWhen } from '@adg/client-components';
import { useUserStore } from '@adg/client-state';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthentication } from '../use-authentication';
import { UserProfileMenu } from './user-profile-menu/user-profile-menu';

export function AuthenticationStatusButton() {
  const { isLoggedIn, onLoginSuccess } = useAuthentication();
  const user = useUserStore.use.user();

  return (
    <RenderWhen>
      <RenderWhen.If isTrue={!isLoggedIn}>
        <GoogleLogin
          onSuccess={onLoginSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </RenderWhen.If>
      <RenderWhen.If isTrue={isLoggedIn}>
        <UserProfileMenu>
          <span>{user?.fullName || 'User Profile'}</span>
        </UserProfileMenu>
      </RenderWhen.If>
    </RenderWhen>
  );
}

export default AuthenticationStatusButton;
