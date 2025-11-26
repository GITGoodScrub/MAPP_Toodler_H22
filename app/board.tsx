import { useLocalSearchParams, router } from 'expo-router';
import { BoardScreen } from '@/screens/BoardScreen';
import { Board } from '@/Services/types';
import { getBoardById } from '@/Services';
import { View, Text, StyleSheet } from 'react-native';

export default function BoardDetailScreen()
{
    const { boardId } = useLocalSearchParams<{ boardId: string }>();
    
    if (!boardId)
    {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Board not found</Text>
            </View>
        );
    }

    const board = getBoardById(parseInt(boardId, 10));

    if (!board)
    {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Board not found</Text>
            </View>
        );
    }

    return (
        <BoardScreen 
            board={board} 
            onBack={() => router.back()}
        />
    );
}

const styles = StyleSheet.create(
{
    errorContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText:
    {
        fontSize: 18,
        color: '#999',
    },
});
