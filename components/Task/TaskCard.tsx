import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../../Services/types';

interface TaskCardProps
{
    task: Task;
    onPress?: () => void;
    onToggleComplete?: () => void;
    onDelete?: () => void;
    onMove?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onToggleComplete, onDelete, onMove }) =>
{
    return (
        <TouchableOpacity 
            style={[styles.container, task.isFinished && styles.containerFinished]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <TouchableOpacity 
                    style={[styles.checkbox, task.isFinished && styles.checkboxChecked]}
                    onPress={(e) =>
                    {
                        e.stopPropagation();
                        if (onToggleComplete)
                        {
                            onToggleComplete();
                        }
                    }}
                >
                    {task.isFinished && (
                        <Text style={styles.checkmark}>✓</Text>
                    )}
                </TouchableOpacity>
                
                <View style={styles.textContainer}>
                    <Text style={[styles.name, task.isFinished && styles.nameFinished]}>
                        {task.name}
                    </Text>
                    {task.description ? (
                        <Text style={[styles.description, task.isFinished && styles.descriptionFinished]} numberOfLines={2}>
                            {task.description}
                        </Text>
                    ) : null}
                </View>

                {onMove && (
                    <TouchableOpacity 
                        style={styles.moveButton}
                        onPress={(e) =>
                        {
                            e.stopPropagation();
                            onMove();
                        }}
                    >
                        <Text style={styles.moveText}>↔</Text>
                    </TouchableOpacity>
                )}

                {onDelete && (
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={(e) =>
                        {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create(
{
    container:
    {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    containerFinished:
    {
        backgroundColor: '#f9f9f9',
        opacity: 0.8,
    },
    content:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox:
    {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007AFF',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked:
    {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    checkmark:
    {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textContainer:
    {
        flex: 1,
    },
    name:
    {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    nameFinished:
    {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    description:
    {
        fontSize: 14,
        color: '#666',
    },
    descriptionFinished:
    {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
    deleteButton:
    {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    deleteText:
    {
        fontSize: 20,
        color: '#666',
        fontWeight: 'bold',
    },
    moveButton:
    {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    moveText:
    {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
    },
});
