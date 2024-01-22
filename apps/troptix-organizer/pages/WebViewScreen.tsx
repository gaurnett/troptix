import { View } from 'react-native-ui-lib';
import { WebView } from 'react-native-webview';

export default function WebViewScreen({ route }) {
  const { url } = route.params;

  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <WebView source={{ uri: url }} />
    </View>
  );
}
