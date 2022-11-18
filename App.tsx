/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Fragment, useEffect, useState} from 'react';
import {useNetInfo} from "@react-native-community/netinfo";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import {CustomModal} from "./components/CustomModal";

const TEST_ENDPOINT = 'https://pushmore.io/webhook/mHesdfYQFp7erLdtJBaSowiS';
const PRODUCTION_ENDPOINT = 'https://pushmore.io/webhook/d3Gm4aEPCuhAUjfbECLLdW41';

const App = () => {
  const netInfo = useNetInfo();

  const [showUserInputModal, setShowUserInputModal] = useState(false);
  const [showRepoInputModal, setShowRepoInputModal] = useState(false);

  const [user, setUser] = useState('user');
  const [repo, setRepo] = useState('repo');

  const [isBadUserOrRepo, setIsBadUserOrRepo] = useState(false);
  const [hasInternetConnection, setHasInternetConnection] = useState(netInfo.isConnected);
  const [isLinkVerified, setIsLinkVerified] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [hasProblemSendingLink, setHasProblemSendingLink] = useState(false);

  const backgroundStyle = {
      backgroundColor: (!hasInternetConnection || isBadUserOrRepo || hasProblemSendingLink)
      ? 'red'
      : isLinkVerified
        ? isLinkSent
          ? '#ffffff'
          : 'green'
        : '#ffffff'
  };

  const textStyle = {
    color: '#000000',
    fontSize: 18
  };

  useEffect(() => {
      setHasInternetConnection(netInfo.isConnected);
  }, [netInfo.isConnected])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        contentInsetAdjustmentBehavior="automatic"
        style={styles.containerView}
      >
        {
          isLinkSent
          ? <View style={styles.centeredView}>
            <Text style={[textStyle, styles.h1, {fontWeight: 'bold'}]}>
              All done!
            </Text>
            <Text style={[textStyle, styles.h1, {fontWeight: 'bold'}]}>
              Repository sent.
            </Text>
            <Text style={[textStyle, styles.button]} onPress={() => {
                setIsLinkSent(false);
                setHasProblemSendingLink(false);
                setIsBadUserOrRepo(false);
                setIsLinkVerified(false);
                setUser("user");
                setRepo("repo");
            }}>
              COOL
            </Text>
          </View>
          : <Fragment>
            <Text style={[textStyle, styles.h3]}>
              Set the repository address
            </Text>
            <Text style={[textStyle, styles.mt3, styles.h1]}>
              github.com
            </Text>
            <View style={styles.stack}>
              <Text style={[textStyle, styles.h1]}>
                /
              </Text>
              <Text style={styles.h1} onPress={() => {
                  setShowUserInputModal(true);
                  setIsLinkVerified(false);
              }}>
                {user}
              </Text>
            </View>
            <View style={[styles.stack, {marginBottom: 10}]}>
              <Text style={[textStyle, styles.h1]}>
                /
              </Text>
              <Text style={styles.h1} onPress={() => {
                  setShowRepoInputModal(true);
                  setIsLinkVerified(false);
              }}>
                {repo}
              </Text>
            </View>
            {
                isBadUserOrRepo
                && <Text style={textStyle}>Check your <Text style={{fontWeight: 'bold'}}>username</Text> or your <Text style={{fontWeight: 'bold'}}>repository</Text> name</Text>
            }
            {
                !isLinkVerified
                && !hasInternetConnection
                && <Text style={textStyle}>Check your <Text style={{fontWeight: 'bold'}}>internet connection</Text></Text>
            }
            {
                hasProblemSendingLink
                && <Text style={textStyle}>Errors while trying to send the link, please try again!</Text>
            }
            {
                isLinkVerified
                ? <Text style={[textStyle, styles.button]} onPress={sendLink}>
                  SEND
                </Text>
                : <Text disabled={!hasInternetConnection} style={[textStyle, styles.button]} onPress={verifyLink}>
                  CHECK
                </Text>
            }
            <CustomModal
              modalTitle="USER"
              inputPlaceholder="Type your github username"
              inputText={user === 'user' ? '' : user}
              isVisible={showUserInputModal}
              toggleVisibile={(isVisible) => setShowUserInputModal(isVisible)}
              onInputConfirm={(inputText) => {setUser(inputText); setShowUserInputModal(false);}}
            />
            <CustomModal
              modalTitle="REPOSITORY"
              inputPlaceholder="Type your repository name"
              inputText={repo === 'repo' ? '' : repo}
              isVisible={showRepoInputModal}
              toggleVisibile={(isVisible) => setShowRepoInputModal(isVisible)}
              onInputConfirm={(inputText) => {setRepo(inputText); setShowRepoInputModal(false);}}
            />
          </Fragment>
        }
      </View>
    </SafeAreaView>
  );

  async function verifyLink() {
      setIsBadUserOrRepo(false);

      if (user === 'user' || repo === 'repo') {
          setIsBadUserOrRepo(true);
      } else if (hasInternetConnection) {
          try {
              const response = await fetch(`https://github.com/${user}/${repo}`);

              if (response.status === 200) {
                  setIsLinkVerified(true);
              } else {
                  setIsBadUserOrRepo(true);
              }
          } catch (e) {
              setIsBadUserOrRepo(true);
          }
      }
  }

  async function sendLink() {
      const response = await fetch(TEST_ENDPOINT,  {
        method: 'POST',
        body: `repoUrl=https://github.com/${user}/${repo}, sender=Flavio Sacca`
      });

      if (response.status === 200) {
          setIsLinkSent(true);
      } else {
          setHasProblemSendingLink(true);
      }
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50
  },
  stack: {
      display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  containerView: {
    height: '100%',
    padding: 20
  },
  h1: {
    fontSize: 32
  },
  h3: {
    fontSize: 24
  },
  mt3: {
    marginTop: 20
  },
  button: {
      fontWeight: 'bold',
    fontSize: 24,
    position: 'absolute',
    bottom: 20,
    right: 20
  }
});

export default App;
