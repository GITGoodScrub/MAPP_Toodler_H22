import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView, SafeAreaView, Animated } from 'react-native';
import { ListCard } from '../components/List';
import { TaskCard } from '../components/Task';
import { getListsByBoardId, createList, deleteList, updateList, getTasksByListId, createTask, deleteTask, updateTask, toggleTaskCompletion, moveTaskToDifferentList } from '../Services';
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
    
    const [moveModalVisible, setMoveModalVisible] = useState(false);
    const [taskToMove, setTaskToMove] = useState<Task | null>(null);
    
    const [showMoveConfirmation, setShowMoveConfirmation] = useState(false);
    const [moveConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showListCreateConfirmation, setShowListCreateConfirmation] = useState(false);
    const [listCreateConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showListUpdateConfirmation, setShowListUpdateConfirmation] = useState(false);
    const [listUpdateConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showTaskCreateConfirmation, setShowTaskCreateConfirmation] = useState(false);
    const [taskCreateConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showTaskUpdateConfirmation, setShowTaskUpdateConfirmation] = useState(false);
    const [taskUpdateConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showListDeleteConfirmation, setShowListDeleteConfirmation] = useState(false);
    const [listDeleteConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [showTaskDeleteConfirmation, setShowTaskDeleteConfirmation] = useState(false);
    const [taskDeleteConfirmationOpacity] = useState(new Animated.Value(0));
    
    const [editListModalVisible, setEditListModalVisible] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [editListName, setEditListName] = useState('');
    const [editListColor, setEditListColor] = useState('#007AFF');
    const [showEditListCancelConfirmation, setShowEditListCancelConfirmation] = useState(false);
    
    const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [showEditTaskCancelConfirmation, setShowEditTaskCancelConfirmation] = useState(false);

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
        
        setShowListCreateConfirmation(true);
        Animated.sequence([
            Animated.timing(listCreateConfirmationOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(1000),
            Animated.timing(listCreateConfirmationOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => setShowListCreateConfirmation(false));
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
                        
                        setShowListDeleteConfirmation(true);
                        Animated.sequence([
                            Animated.timing(listDeleteConfirmationOpacity, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.delay(1000),
                            Animated.timing(listDeleteConfirmationOpacity, {
                                toValue: 0,
                                duration: 500,
                                useNativeDriver: true,
                            }),
                        ]).start(() => setShowListDeleteConfirmation(false));
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
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
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
                        deleteTask(taskId);
                        refreshLists();
                        
                        setShowTaskDeleteConfirmation(true);
                        Animated.sequence([
                            Animated.timing(taskDeleteConfirmationOpacity, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.delay(1000),
                            Animated.timing(taskDeleteConfirmationOpacity, {
                                toValue: 0,
                                duration: 500,
                                useNativeDriver: true,
                            }),
                        ]).start(() => setShowTaskDeleteConfirmation(false));
                    },
                },
            ]
        );
    };

    const handleMoveTask = (task: Task) =>
    {
        setTaskToMove(task);
        setMoveModalVisible(true);
    };

    const handleConfirmMoveTask = (targetListId: number) =>
    {
        if (taskToMove)
        {
            moveTaskToDifferentList(taskToMove.id, targetListId);
            setMoveModalVisible(false);
            setTaskToMove(null);
            refreshLists();
            
            setShowMoveConfirmation(true);
            Animated.sequence([
                Animated.timing(moveConfirmationOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(moveConfirmationOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowMoveConfirmation(false));
        }
    };

    const handleAddTask = (listId: number) =>
    {
        setSelectedListId(listId);
        setTaskModalVisible(true);
    };

    const handleEditList = (list: List) =>
    {
        setEditingList(list);
        setEditListName(list.name);
        setEditListColor(list.color);
        setEditListModalVisible(true);
    };

    const handleUpdateList = () =>
    {
        if (!editListName.trim())
        {
            Alert.alert('Error', 'List name is required');
            return;
        }

        if (editingList)
        {
            updateList(editingList.id, {
                name: editListName.trim(),
                color: editListColor
            });

            setEditListModalVisible(false);
            setEditingList(null);
            setEditListName('');
            setEditListColor('#007AFF');
            refreshLists();
            
            setShowListUpdateConfirmation(true);
            Animated.sequence([
                Animated.timing(listUpdateConfirmationOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(listUpdateConfirmationOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowListUpdateConfirmation(false));
        }
    };

    const handleEditTask = (task: Task) =>
    {
        setEditingTask(task);
        setEditTaskName(task.name);
        setEditTaskDescription(task.description);
        setEditTaskModalVisible(true);
    };

    const handleUpdateTask = () =>
    {
        if (!editTaskName.trim())
        {
            Alert.alert('Error', 'Task name is required');
            return;
        }

        if (editingTask)
        {
            updateTask(editingTask.id, {
                name: editTaskName.trim(),
                description: editTaskDescription.trim()
            });

            setEditTaskModalVisible(false);
            setEditingTask(null);
            setEditTaskName('');
            setEditTaskDescription('');
            refreshLists();
            
            setShowTaskUpdateConfirmation(true);
            Animated.sequence([
                Animated.timing(taskUpdateConfirmationOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(taskUpdateConfirmationOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowTaskUpdateConfirmation(false));
        }
    };

    const listHasChanges = editingList && (
        editListName !== editingList.name ||
        editListColor !== editingList.color
    );

    const taskHasChanges = editingTask && (
        editTaskName !== editingTask.name ||
        editTaskDescription !== editingTask.description
    );

    const handleEditListCancel = () =>
    {
        if (listHasChanges)
        {
            setEditListModalVisible(false);
            setShowEditListCancelConfirmation(true);
        }
        else
        {
            setEditListModalVisible(false);
            setEditingList(null);
            setEditListName('');
            setEditListColor('#007AFF');
        }
    };

    const handleKeepEditingList = () =>
    {
        setShowEditListCancelConfirmation(false);
        setEditListModalVisible(true);
    };

    const handleConfirmDiscardList = () =>
    {
        setShowEditListCancelConfirmation(false);
        setEditListModalVisible(false);
        setEditingList(null);
        setEditListName('');
        setEditListColor('#007AFF');
    };

    const handleEditTaskCancel = () =>
    {
        if (taskHasChanges)
        {
            setEditTaskModalVisible(false);
            setShowEditTaskCancelConfirmation(true);
        }
        else
        {
            setEditTaskModalVisible(false);
            setEditingTask(null);
            setEditTaskName('');
            setEditTaskDescription('');
        }
    };

    const handleKeepEditingTask = () =>
    {
        setShowEditTaskCancelConfirmation(false);
        setEditTaskModalVisible(true);
    };

    const handleConfirmDiscardTask = () =>
    {
        setShowEditTaskCancelConfirmation(false);
        setEditTaskModalVisible(false);
        setEditingTask(null);
        setEditTaskName('');
        setEditTaskDescription('');
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
            
            setShowTaskCreateConfirmation(true);
            Animated.sequence([
                Animated.timing(taskCreateConfirmationOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(taskCreateConfirmationOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowTaskCreateConfirmation(false));
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
                    onEdit={() => handleEditList(item)}
                />
                
                {isExpanded && (
                    <View style={styles.tasksContainer}>
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggleComplete={() => handleToggleTask(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                                onMove={() => handleMoveTask(task)}
                                onEdit={() => handleEditTask(task)}
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

                <Modal
                    visible={moveModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setMoveModalVisible(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() =>
                        {
                            setMoveModalVisible(false);
                            setTaskToMove(null);
                        }}
                    >
                        <TouchableOpacity 
                            style={styles.modalContent}
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <Text style={styles.modalTitle}>Move Task To...</Text>
                            
                            {taskToMove && (
                                <Text style={styles.taskMoveLabel}>"{taskToMove.name}"</Text>
                            )}

                            <ScrollView style={styles.listSelectionContainer}>
                                {lists
                                    .filter(list => list.id !== taskToMove?.listId)
                                    .map((list) => (
                                        <TouchableOpacity
                                            key={list.id}
                                            style={styles.listSelectionItem}
                                            onPress={() => handleConfirmMoveTask(list.id)}
                                        >
                                            <View style={[styles.listColorIndicator, { backgroundColor: list.color }]} />
                                            <Text style={styles.listSelectionText}>{list.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() =>
                                {
                                    setMoveModalVisible(false);
                                    setTaskToMove(null);
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
                
                <Modal
                    visible={editListModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setEditListModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit List</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="List Name *"
                                value={editListName}
                                onChangeText={setEditListName}
                                maxLength={50}
                            />

                            <Text style={styles.colorLabel}>List Color</Text>
                            <View style={styles.colorPicker}>
                                {colorOptions.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color },
                                            editListColor === color && styles.colorOptionSelected
                                        ]}
                                        onPress={() => setEditListColor(color)}
                                    />
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={handleEditListCancel}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.createButton, !listHasChanges && styles.disabledButton]}
                                    onPress={handleUpdateList}
                                    disabled={!listHasChanges}
                                >
                                    <Text style={[styles.createButtonText, !listHasChanges && styles.disabledButtonText]}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                {/* List Edit Cancel Confirmation */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showEditListCancelConfirmation}
                    onRequestClose={() => setShowEditListCancelConfirmation(false)}
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
                                    onPress={handleKeepEditingList}
                                >
                                    <Text style={styles.confirmationButtonText}>Keep Editing</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.confirmationButton, styles.confirmationDeleteButton]}
                                    onPress={handleConfirmDiscardList}
                                >
                                    <Text style={styles.confirmationButtonText}>Discard</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                <Modal
                    visible={editTaskModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setEditTaskModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Task</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Task Name *"
                                value={editTaskName}
                                onChangeText={setEditTaskName}
                                maxLength={100}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Description (optional)"
                                value={editTaskDescription}
                                onChangeText={setEditTaskDescription}
                                multiline
                                numberOfLines={3}
                                maxLength={200}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={handleEditTaskCancel}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.createButton, !taskHasChanges && styles.disabledButton]}
                                    onPress={handleUpdateTask}
                                    disabled={!taskHasChanges}
                                >
                                    <Text style={[styles.createButtonText, !taskHasChanges && styles.disabledButtonText]}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                {/* Task Edit Cancel Confirmation */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showEditTaskCancelConfirmation}
                    onRequestClose={() => setShowEditTaskCancelConfirmation(false)}
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
                                    onPress={handleKeepEditingTask}
                                >
                                    <Text style={styles.confirmationButtonText}>Keep Editing</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.confirmationButton, styles.confirmationDeleteButton]}
                                    onPress={handleConfirmDiscardTask}
                                >
                                    <Text style={styles.confirmationButtonText}>Discard</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                {showMoveConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: moveConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Task moved successfully</Text>
                    </Animated.View>
                )}
                
                {showListCreateConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: listCreateConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ List created successfully</Text>
                    </Animated.View>
                )}
                
                {showListUpdateConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: listUpdateConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Changes saved successfully</Text>
                    </Animated.View>
                )}
                
                {showTaskCreateConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: taskCreateConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Task created successfully</Text>
                    </Animated.View>
                )}
                
                {showTaskUpdateConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: taskUpdateConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Changes saved successfully</Text>
                    </Animated.View>
                )}
                
                {showListDeleteConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: listDeleteConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ List deleted successfully</Text>
                    </Animated.View>
                )}
                
                {showTaskDeleteConfirmation && (
                    <Animated.View 
                        style={[
                            styles.confirmationToast,
                            { opacity: taskDeleteConfirmationOpacity }
                        ]}
                        pointerEvents="none"
                    >
                        <Text style={styles.confirmationToastText}>✓ Task deleted successfully</Text>
                    </Animated.View>
                )}
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
    taskMoveLabel:
    {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    listSelectionContainer:
    {
        maxHeight: 300,
        marginBottom: 16,
    },
    listSelectionItem:
    {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    listColorIndicator:
    {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 12,
    },
    listSelectionText:
    {
        fontSize: 16,
        color: '#333',
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
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
