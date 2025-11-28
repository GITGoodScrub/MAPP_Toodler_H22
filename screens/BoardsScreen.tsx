import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, SafeAreaView, Animated } from 'react-native';
import { router } from 'expo-router';
import { BoardCard } from '../components/Board';
import { getAllBoards, createBoard, deleteBoard, updateBoard } from '../Services';
import { Board } from '../Services/types';

export const BoardsScreen: React.FC = () =>
{
    const [boards, setBoards] = useState<Board[]>(getAllBoards());
    const [modalVisible, setModalVisible] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');
    const [newBoardThumbnail, setNewBoardThumbnail] = useState('');
    
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [editBoardName, setEditBoardName] = useState('');
    const [editBoardDescription, setEditBoardDescription] = useState('');
    const [editBoardThumbnail, setEditBoardThumbnail] = useState('');
    const [showEditCancelConfirmation, setShowEditCancelConfirmation] = useState(false);
    
    const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
    const [createConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [updateConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteConfirmationOpacity] = useState(new Animated.Value(0));

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
        
        setShowCreateConfirmation(true);
        Animated.sequence([
            Animated.timing(createConfirmationOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(1000),
            Animated.timing(createConfirmationOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => setShowCreateConfirmation(false));
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
                        
                        setShowDeleteConfirmation(true);
                        Animated.sequence([
                            Animated.timing(deleteConfirmationOpacity, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.delay(1000),
                            Animated.timing(deleteConfirmationOpacity, {
                                toValue: 0,
                                duration: 500,
                                useNativeDriver: true,
                            }),
                        ]).start(() => setShowDeleteConfirmation(false));
                    },
                },
            ]
        );
    };

    const handleBoardPress = (board: Board) =>
    {
        router.push(`/board?boardId=${board.id}`);
    };

    const handleEditBoard = (board: Board) =>
    {
        setEditingBoard(board);
        setEditBoardName(board.name);
        setEditBoardDescription(board.description);
        setEditBoardThumbnail(board.thumbnailPhoto);
        setEditModalVisible(true);
    };

    const handleUpdateBoard = () =>
    {
        if (!editBoardName.trim())
        {
            Alert.alert('Error', 'Board name is required');
            return;
        }

        if (editingBoard)
        {
            const thumbnailUrl = editBoardThumbnail.trim() || 'https://via.placeholder.com/400x150/4A90E2/ffffff?text=Board';
            
            updateBoard(editingBoard.id, {
                name: editBoardName.trim(),
                description: editBoardDescription.trim(),
                thumbnailPhoto: thumbnailUrl
            });

            setEditModalVisible(false);
            setEditingBoard(null);
            setEditBoardName('');
            setEditBoardDescription('');
            setEditBoardThumbnail('');
            refreshBoards();
            
            setShowUpdateConfirmation(true);
            Animated.sequence([
                Animated.timing(updateConfirmationOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(updateConfirmationOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowUpdateConfirmation(false));
        }
    };

    const boardHasChanges = editingBoard && (
        editBoardName !== editingBoard.name ||
        editBoardDescription !== editingBoard.description ||
        editBoardThumbnail !== editingBoard.thumbnailPhoto
    );

    const handleEditCancel = () =>
    {
        if (boardHasChanges)
        {
            setEditModalVisible(false);
            setShowEditCancelConfirmation(true);
        }
        else
        {
            setEditModalVisible(false);
            setEditingBoard(null);
            setEditBoardName('');
            setEditBoardDescription('');
            setEditBoardThumbnail('');
        }
    };

    const handleKeepEditing = () =>
    {
        setShowEditCancelConfirmation(false);
        setEditModalVisible(true);
    };

    const handleConfirmDiscard = () =>
    {
        setShowEditCancelConfirmation(false);
        setEditModalVisible(false);
        setEditingBoard(null);
        setEditBoardName('');
        setEditBoardDescription('');
        setEditBoardThumbnail('');
    };

    const renderBoard = ({ item }: { item: Board }) => (
        <BoardCard
            board={item}
            onPress={() => handleBoardPress(item)}
            onDelete={() => handleDeleteBoard(item.id, item.name)}
            onEdit={() => handleEditBoard(item)}
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
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
                
                <Modal
                    visible={editModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Board</Text>
                            
                            <TextInput
                                style={styles.input}
                                placeholder="Board Name *"
                                value={editBoardName}
                                onChangeText={setEditBoardName}
                                maxLength={50}
                            />
                            
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Description (optional)"
                                value={editBoardDescription}
                                onChangeText={setEditBoardDescription}
                                multiline
                                numberOfLines={3}
                                maxLength={150}
                            />
                            
                            <TextInput
                                style={styles.input}
                                placeholder="Thumbnail URL (optional)"
                                value={editBoardThumbnail}
                                onChangeText={setEditBoardThumbnail}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={handleEditCancel}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.createButton, !boardHasChanges && styles.disabledButton]}
                                    onPress={handleUpdateBoard}
                                    disabled={!boardHasChanges}
                                >
                                    <Text style={[styles.createButtonText, !boardHasChanges && styles.disabledButtonText]}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                {/* Board Edit Cancel Confirmation */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showEditCancelConfirmation}
                    onRequestClose={() => setShowEditCancelConfirmation(false)}
                >
                    <View style={styles.confirmationOverlay}>
                        <View style={styles.confirmationDialog}>
                            <Text style={styles.confirmationTitle}>Discard Changes?</Text>
                            <Text style={styles.confirmationText}>
                                You have unsaved changes. Are you sure you want to discard them?
                            </Text>
                            <View style={styles.confirmationButtons}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.confirmationButton, styles.confirmationCancelButton]}
                                    onPress={handleKeepEditing}
                                >
                                    <Text style={styles.confirmationButtonText}>Keep Editing</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.confirmationButton, styles.confirmationDeleteButton]}
                                    onPress={handleConfirmDiscard}
                                >
                                    <Text style={styles.confirmationButtonText}>Discard</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                {showCreateConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: createConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Board created successfully</Text>
                    </Animated.View>
                )}
                
                {showUpdateConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: updateConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Changes saved successfully</Text>
                    </Animated.View>
                )}
                
                {showDeleteConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: deleteConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Board deleted successfully</Text>
                    </Animated.View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create(
{
    safeArea:
    {
        flex: 1,
        backgroundColor: '#fff',
    },
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
    confirmationToast:
    {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    confirmationToastText:
    {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmationText:
    {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    disabledButton:
    {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    disabledButtonText:
    {
        color: '#999',
    },
    confirmationOverlay:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    confirmationDialog:
    {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '80%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    confirmationTitle:
    {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    confirmationButtons:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    confirmationButton:
    {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmationCancelButton:
    {
        backgroundColor: '#6c757d',
    },
    confirmationDeleteButton:
    {
        backgroundColor: '#dc3545',
    },
    confirmationButtonText:
    {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
