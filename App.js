import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import Loading from './auth/Loading'
import Login from './auth/Login'
import Register from './auth/Register'
import User from './Main/User'
import ChooseAge from './Main/ChooseAge'

const stack = createStackNavigator()

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setloading] = useState(true)
  const navigationOptions = {
    headerShown: false
  }
  const CheckUser = () => {
    auth().onAuthStateChanged((user) => {
      const usersRef = database();
      if (user) {
        usersRef
          .ref(`user/${user.uid}`)
          .once('value')
          .then((snapshot) => {
            const userData = snapshot.val();
            setloading(false)
            setUser(userData)
          })
          .catch(() => {
            setloading(false)
          });
      }
      else {
        setloading(false)
        setUser(null)
      }
    })
  }
  useEffect(() => {
    CheckUser()
  }, [user])
  return (
    <NavigationContainer>
      <StatusBar
        barStyle='light-content' />
      <stack.Navigator>

        {loading ?
          <stack.Screen
            name="Loading"
            component={Loading}
            options={navigationOptions}
          />
          :
          <>
            {
              user !== null ?
                <>
                  <stack.Screen
                    name="user"
                    component={User}
                    options={navigationOptions}
                  />
                  < stack.Screen
                    name="chooseAge"
                    component={ChooseAge}
                    options={navigationOptions}
                  />
                </>
                :
                <>
                  <stack.Screen
                    name="register"
                    component={Register}
                    options={navigationOptions}
                  />
                  <stack.Screen
                    name="login"
                    component={Login}
                    options={navigationOptions}
                  />
                </>
            }
          </>
        }
      </stack.Navigator>
    </NavigationContainer >
  );

}
export default App;
