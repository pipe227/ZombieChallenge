import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet,Text, View, FlatList, Modal,TouchableOpacity, TextInput, Picker,ActivityIndicator,ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';

  export default function App() {

    const [isRender, setisRender] = useState(false);
    const [isModalVisible, setisModalVisible] = useState(false);
    const [inputText, setImputText] = useState("0");
    const [editItem, setedItem] = useState();
    const [selectedValue, setSelectedValue] = useState("0");
    const [loading, setLoading] = useState(true); 
    const [data, setdata] = useState([]); 
    const [warehouse, setwarehouse] = useState([]);
    const [school, setschool] = useState([]);
    const [hospital, sethospital] = useState([]);


    useEffect(() => {
      const subscriber = firestore().collection('zombie')
      .onSnapshot(querySnapshot => {
        const data = [];
        const warehouse = [];
        const school = [];
        const hospital = [];
        //get data and store in diferent lists...
        querySnapshot.forEach(documentSnapshot => {
          data.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
          switch(documentSnapshot.data().local) {
            case "00":
              warehouse.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
              break;
            case "01":
              school.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });

              break;
            case "02":
              hospital.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });

              break;
            
          }

        });
      
        console.log('Total list: ',data);
        setwarehouse(warehouse);
        setschool(school);
        sethospital(hospital);
        setdata(data);

        setLoading(false);
      });
  
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);
  
    if (loading) {
      return <ActivityIndicator />;
    }

    const onPressItem = (item) =>{
      setisModalVisible(true);
      setImputText(item.local);
      setedItem(item.key);
     }


    const renderItem = ({item, index}) => (
      <TouchableOpacity
       style={styles.item}
       onPress={() => onPressItem(item)}>
        <Text style={styles.text}>{item.key}</Text>
      </TouchableOpacity>
    );

    const handleEditItem =(editItem) =>{
      
          const newData = data.map(item => {
            if (item.key == editItem){
              item.local = inputText
              firestore()
              .collection('zombie')
              .doc(item.key)
              .update({
                local: inputText,
              })
              .then(() => {
                console.log('User updated!');
              }); 
              return item;
            }
            return item;
          });
          
          setdata(newData);
          setisRender(!isRender)
    }
  
     
    

    const  onPressSaveEdit = () =>{
        handleEditItem(editItem);
        setisModalVisible(false); //Cloe Modal... item 'saved
    }


    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>

        <View style = {styles.titleContainer}>
        <Text style = {styles.title}>Warehourse</Text>
        </View>

        <FlatList
          data={warehouse}
          keyExtractor={item => item.key} 
          renderItem={renderItem}
          extraData={isRender}
        />
       

        <View style = {styles.titleContainer}>
        <Text style = {styles.title}>School</Text>
        </View>


        <FlatList
          data={school}
          keyExtractor={item => item.key} 
          renderItem={renderItem}
          extraData={isRender}
        /> 

        <View style = {styles.titleContainer}>
        <Text style = {styles.title}>Hospital</Text>
        </View>


        <FlatList
          data={hospital}
          keyExtractor={item => item.key} 
          renderItem={renderItem}
          extraData={isRender}
        />  
        </ScrollView>



        <Modal
        animationType='fade'
        visible={isModalVisible}
        onRequestClose={() => setisModalVisible(false)}>

          <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Option to Change location: </Text>
          <View style={styles.line}></View>

        <View style={styles.pickerContainer}
>
            <Picker
              selectedValue={inputText}
              style={styles.picker}
              onValueChange={(local, itemIndex) => setImputText(local)}
            >
              <Picker.Item label="Warehouse" value="00" />
              <Picker.Item label="School" value="01" />
              <Picker.Item label="Hospital" value="02" />
            </Picker>
        </View>

        <View style={styles.line}></View>

          <TouchableOpacity
          onPress={() => onPressSaveEdit()}
          style={styles.touchableSave}>
            <Text style={styles.modalText}>Save</Text>
          </TouchableOpacity>

          </View>

        </Modal>

      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
    },
    scrollView: {
      backgroundColor: 'white',
      marginHorizontal: 20,
    },
    item: {
      backgroundColor: 'grey',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 20,
      color: 'white'
    },
    modalText: {
      fontSize: 60,
      color: 'black',
      marginBottom: 20,
    },
    titleContainer:{
      alignItems: 'center',
      justifyContent: 'center',
    },
    title:{
      fontSize: 40,
    },
    textInput:{
      width: '90%',
      height: 70,
      borderColor: 'grey',
      borderWidth: 1,
    },
    modalView:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    pickerContainer:{
      paddingTop: 40,
      alignItems: "center"
    },

    picker:{
      height: 150,
      width: 300,
    },

    line:{
      backgroundColor: 'gray',
      width: '100%',
      height: 1,
    },

    touchableSave: {
    paddingHorizontal: 100,
    alignItems: 'center',
    marginTop: 20
    },
  });
  
