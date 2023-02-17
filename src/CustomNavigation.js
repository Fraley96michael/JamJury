import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RolePage from "./screens/RolePage";
import ActiveCompetitionScreen from "./screens/ActiveCompetitionScreen";
import CompetitorSignUpScreen from "./screens/CompetitorSignUpScreen";
import CurrentCompetitionScreen from "./screens/CurrentCompetitionScreen";
import VotingPage from "./screens/VotingPage";
const Stack = createStackNavigator();

export const FirstScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="ActiveCompetitionScreen"
        component={ActiveCompetitionScreen}
        initialParams={{ user: null }}
      />
      <Stack.Screen name="RolePage" component={RolePage} />
      <Stack.Screen
        name="CompetitorSignUpScreen"
        component={CompetitorSignUpScreen}
      />
      <Stack.Screen
        name="CurrentCompetitonScreen"
        component={CurrentCompetitionScreen}
        options={{
          title: "CurrentCompetitonScreen",
          //remove the ability to go back
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name="VotingPage"
        component={VotingPage}
        options={{
          title: "VotingPage",
        }}
      />
    </Stack.Navigator>
  );
};
