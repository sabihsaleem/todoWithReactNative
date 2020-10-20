import React,{Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, AsyncStorage, Button, } from 'react-native';

const viewPadding = 10;

class App extends Component {
  state = {
    listname: [],
    text: ""
  };

  ComponentDidMount() {
    Keyboard.addListener(
      "keyboardDidShow" ,
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      "keyboardDidHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    List.all(listname => this.setState({ listname: listname || [] }));
  }

  onChangeText=(text)=>{
    console.log("text", text)
    this.setState({ text : text });
  };

  AddItemsToArray=()=>{
 
    let data1 =this.state.text.trim().length>0;
    console.log("data1", data1)
    if( data1 ){
      this.setState(
        prevState => {
          let { listname, text} = prevState;
          return {
            listname: listname.concat({ key: listname.length , text: text }),
            text: ""
          };
        },
        () => List.save(this.state.listname)
      );
    }

  };

  deleteTask = (i) => {
    console.log("deleteTask", i)
    this.setState(
      prevState => {
        let listname = prevState.listname.slice();

        listname.splice(i,1);
        console.log("listname", listname)

        return { listname: listname };

      },
      () => List.save(this.state.listname)
    );
  };

  render() {
    console.log("render",this.state.text)
      return (
      <View style={styles.container}>

        <FlatList style={styles.list}

          data = {this.state.listname}
          renderItem = {({ item, index }) =>
          <View>
            <View style={styles.listItemCont}>
              <Text style={styles.listItem}>
                {item.text}
              </Text>
              <Button 
              title="Delete" onPress={() => this.deleteTask(index)}
              />
            </View>
              <View style={styles.hr} />
          </View>}

        />
<View style={{flexDirection:"row" , marginHorizontal:10}} >
<TextInput
          style={styles.textInput}
          onChangeText={this.onChangeText}
          value={this.state.text}
          placeholder="Add Tasks"
        />
        
        <TouchableOpacity 
        style={{backgroundColor:'red', paddingHorizontal:10 }}
          onPress={this.AddItemsToArray}
          >

<Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
</View>
        
{/* 
        <View style={{ paddingBottom: 10, paddingLeft: 350 }}>

          
   

        </View> */}
      </View>
    );
  }
}

let List = {
  convertToArrayOfObject(listname, callback) {
    return callback(
      listname ? listname.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(listname) {
    return listname.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, listname) =>
      this.convertToArrayOfObject(listname, callback)
    );
  },
  save(listname) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(listname));
  }
};

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: viewPadding,
    paddingTop: 20
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18
  },
  hr: {
    height: 1,
    backgroundColor: "blue"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "black",
    width: "100%"
  },
  addButtonText: {
    color:'#ffffff',
    fontSize: 24,
  },
});
