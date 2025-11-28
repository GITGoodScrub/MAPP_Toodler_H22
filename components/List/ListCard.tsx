import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { List } from '../../Services/types';

interface ListCardProps
{
    list: List;
    taskCount?: number;
    onPress?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
}

export const ListCard: React.FC<ListCardProps> = ({ list, taskCount = 0, onPress, onDelete, onEdit }) =>
{
    return (
        <TouchableOpacity 
            style={[styles.container, { borderLeftColor: list.color }]} 
            onPress={onPress}
            onLongPress={onEdit}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <Text style={styles.name}>{list.name}</Text>
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
            <Text style={styles.taskCount}>
                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create(
{
    container:
    {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    header:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    name:
    {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    taskCount:
    {
        fontSize: 14,
        color: '#666',
    },
    deleteButton:
    {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    deleteText:
    {
        fontSize: 20,
        color: '#666',
        fontWeight: 'bold',
    },
});
