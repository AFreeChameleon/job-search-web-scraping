import passportLocal from 'passport-local';
import User from '../model/User';

const localStrategy = passportLocal.Strategy;

export default function(passport: any) {
  passport.serializeUser((data: any, done: any) => {
    done(null, data);
  });

  passport.deserializeUser((data: any, done: any) => {
    done(null, data);
  });

  passport.use(new localStrategy((username, password, done) => {
    User.findOne({
      username: username
    }, (err: any, data: any) => {
      if (err) {
        done(err);
      } else if (data) {
        if (data.comparePassword(password, data.password)) {
          done(null, {
            username: data.username,
            password: data.password
          })
        }
      } else {
        done(null, false)
      }
    });
  }));
}