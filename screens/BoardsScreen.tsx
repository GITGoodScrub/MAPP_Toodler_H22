import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { BoardCard } from '../components/Board';
import { getAllBoards, createBoard, deleteBoard } from '../Services';
import { Board } from '../Services/types';

export const BoardsScreen: React.FC = () =>
{
    const [boards, setBoards] = useState<Board[]>(getAllBoards());
    const [modalVisible, setModalVisible] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');
    const [newBoardThumbnail, setNewBoardThumbnail] = useState('');

    const refreshBoards = useCallback(() =>
    {
        setBoards(getAllBoards());
    }, []);

    const handleCreateBoard = () =>
    {
        if (!newBoardName.trim())
        {
            Alert.alert('Error', 'Board name is required');
            return;
        }

        const thumbnailUrl = newBoardThumbnail.trim() || 'https://via.placeholder.com/400x150/4A90E2/ffffff?text=Board';
        
        createBoard(
            newBoardName.trim(),
            newBoardDescription.trim(),
            thumbnailUrl
        );

        setNewBoardName('');
        setNewBoardDescription('');
        setNewBoardThumbnail('');
        setModalVisible(false);
        refreshBoards();
    };

    const handleDeleteBoard = (boardId: number, boardName: string) =>
    {
        Alert.alert(
            'Delete Board',
            `Are you sure you want to delete "${boardName}"? This will also delete all lists and tasks in this board.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () =>
                    {
                        deleteBoard(boardId);
                        refreshBoards();
                    },
                },
            ]
        );
    };

    const handleBoardPress = (board: Board) =>
    {
        // TODO: Navigate to board detail screen
        console.log('Navigate to board:', board.name);
    };

    const renderBoard = ({ item }: { item: Board }) => (
        <BoardCard
            board={item}
            onPress={() => handleBoardPress(item)}
            onDelete={() => handleDeleteBoard(item.id, item.name)}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Boards</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ New Board</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={boards}
                renderItem={renderBoard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Board</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Board Name *"
                            value={newBoardName}
                            onChangeText={setNewBoardName}
                            maxLength={50}
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description (optional)"
                            value={newBoardDescription}
                            onChangeText={setNewBoardDescription}
                            multiline
                            numberOfLines={3}
                            maxLength={200}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Thumbnail URL (optional)"
                            value={newBoardThumbnail}
                            onChangeText={setNewBoardThumbnail}
                            keyboardType="url"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() =>
                                {
                                    setModalVisible(false);
                                    setNewBoardName('');
                                    setNewBoardDescription('');
                                    setNewBoardThumbnail('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.createButton]}
                                onPress={handleCreateBoard}
                            >
                                <Text style={styles.createButtonText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create(
{
    container:
    {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title:
    {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton:
    {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText:
    {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent:
    {
        padding: 20,
    },
    modalOverlay:
    {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent:
    {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle:
    {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input:
    {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea:
    {
        height: 80,
        textAlignVertical: 'top',
    },
    modalButtons:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton:
    {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton:
    {
        backgroundColor: '#f0f0f0',
    },
    cancelButtonText:
    {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    createButton:
    {
        backgroundColor: '#007AFF',
    },
    createButtonText:
    {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
