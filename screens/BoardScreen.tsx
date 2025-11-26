import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView, SafeAreaView } from 'react-native';
import { ListCard } from '../components/List';
import { TaskCard } from '../components/Task';
import { getListsByBoardId, createList, deleteList, getTasksByListId, createTask, deleteTask, toggleTaskCompletion } from '../Services';
import { Board, List, Task } from '../Services/types';

interface BoardScreenProps
{
    board: Board;
    onBack?: () => void;
}

export const BoardScreen: React.FC<BoardScreenProps> = ({ board, onBack }) =>
{
    const [lists, setLists] = useState<List[]>(getListsByBoardId(board.id));
    const [modalVisible, setModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListColor, setNewListColor] = useState('#007AFF');
    const [expandedListId, setExpandedListId] = useState<number | null>(null);
    
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    const refreshLists = useCallback(() =>
    {
        setLists(getListsByBoardId(board.id));
    }, [board.id]);

    const handleCreateList = () =>
    {
        if (!newListName.trim())
        {
            Alert.alert('Error', 'List name is required');
            return;
        }

        createList(newListName.trim(), board.id, newListColor);

        setNewListName('');
        setNewListColor('#007AFF');
        setModalVisible(false);
        refreshLists();
    };

    const handleDeleteList = (listId: number, listName: string) =>
    {
        Alert.alert(
            'Delete List',
            `Are you sure you want to delete "${listName}"? This will also delete all tasks in this list.`,
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
                        deleteList(listId);
                        refreshLists();
                    },
                },
            ]
        );
    };

    const handleListPress = (listId: number) =>
    {
        setExpandedListId(expandedListId === listId ? null : listId);
    };

    const handleToggleTask = (taskId: number) =>
    {
        toggleTaskCompletion(taskId);
        refreshLists();
    };

    const handleDeleteTask = (taskId: number) =>
    {
        deleteTask(taskId);
        refreshLists();
    };

    const handleAddTask = (listId: number) =>
    {
        setSelectedListId(listId);
        setTaskModalVisible(true);
    };

    const handleCreateTask = () =>
    {
        if (!newTaskName.trim())
        {
            Alert.alert('Error', 'Task name is required');
            return;
        }

        if (selectedListId !== null)
        {
            createTask(newTaskName.trim(), newTaskDescription.trim(), selectedListId);
            setNewTaskName('');
            setNewTaskDescription('');
            setTaskModalVisible(false);
            refreshLists();
        }
    };

    const renderList = ({ item }: { item: List }) =>
    {
        const tasks = getTasksByListId(item.id);
        const isExpanded = expandedListId === item.id;

        return (
            <View style={styles.listContainer}>
                <ListCard
                    list={item}
                    taskCount={tasks.length}
                    onPress={() => handleListPress(item.id)}
                    onDelete={() => handleDeleteList(item.id, item.name)}
                />
                
                {isExpanded && (
                    <View style={styles.tasksContainer}>
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggleComplete={() => handleToggleTask(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                            />
                        ))}
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => handleAddTask(item.id)}
                        >
                            <Text style={styles.addButtonText}>+ Add Task</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const colorOptions = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#FF2D55'];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={onBack}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{board.name}</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ New List</Text>
                </TouchableOpacity>
            </View>

            {board.description ? (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{board.description}</Text>
                </View>
            ) : null}

            <FlatList
                data={lists}
                renderItem={renderList}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No lists yet. Create one to get started!</Text>
                }
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New List</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="List Name *"
                            value={newListName}
                            onChangeText={setNewListName}
                            maxLength={50}
                        />

                        <Text style={styles.colorLabel}>Choose Color:</Text>
                        <View style={styles.colorPicker}>
                            {colorOptions.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        newListColor === color && styles.colorOptionSelected,
                                    ]}
                                    onPress={() => setNewListColor(color)}
                                />
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() =>
                                {
                                    setModalVisible(false);
                                    setNewListName('');
                                    setNewListColor('#007AFF');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.createButton]}
                                onPress={handleCreateList}
                            >
                                <Text style={styles.createButtonText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </Modal>

                <Modal
                    visible={taskModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setTaskModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create New Task</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Task Name *"
                                value={newTaskName}
                                onChangeText={setNewTaskName}
                                maxLength={100}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Description (optional)"
                                value={newTaskDescription}
                                onChangeText={setNewTaskDescription}
                                multiline
                                numberOfLines={3}
                                maxLength={200}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() =>
                                    {
                                        setTaskModalVisible(false);
                                        setNewTaskName('');
                                        setNewTaskDescription('');
                                        setSelectedListId(null);
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.createButton]}
                                    onPress={handleCreateTask}
                                >
                                    <Text style={styles.createButtonText}>Create</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};const styles = StyleSheet.create(
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
    backButton:
    {
        paddingRight: 10,
    },
    backButtonText:
    {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    title:
    {
        flex: 1,
        fontSize: 24,
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
    descriptionContainer:
    {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    description:
    {
        fontSize: 14,
        color: '#666',
    },
    listContent:
    {
        padding: 20,
    },
    listContainer:
    {
        marginBottom: 10,
    },
    tasksContainer:
    {
        backgroundColor: '#fafafa',
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
    },
    noTasksText:
    {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        fontStyle: 'italic',
        paddingVertical: 10,
    },
    emptyText:
    {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
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
    colorLabel:
    {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    colorPicker:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    colorOption:
    {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorOptionSelected:
    {
        borderColor: '#333',
        borderWidth: 3,
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
