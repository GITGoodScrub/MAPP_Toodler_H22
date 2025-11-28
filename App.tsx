import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { getAllBoards } from './Services';

export default function App()
{
    const boards = getAllBoards();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Toodler - Boards</Text>
            <ScrollView style={styles.boardList}>
                {boards.map((board) => (
                    <View key={board.id} style={styles.boardItem}>
                        <Text style={styles.boardName}>{board.name}</Text>
                        <Text style={styles.boardDescription}>{board.description}</Text>
                    </View>
                ))}
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create(
{
    container:
    {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title:
    {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    boardList:
    {
        flex: 1,
    },
    boardItem:
    {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    boardName:
    {
        fontSize: 18,
        fontWeight: 'bold',
    },
    boardDescription:
    {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});
