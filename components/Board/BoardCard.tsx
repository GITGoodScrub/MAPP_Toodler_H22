import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Board } from '../../Services/types';

interface BoardCardProps
{
    board: Board;
    onPress?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, onPress, onDelete, onEdit }) =>
{
    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={onPress}
            onLongPress={onEdit}
            activeOpacity={0.7}
        >
            <Image 
                source={{ uri: board.thumbnailPhoto }} 
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={styles.overlay} pointerEvents="box-none">
                <View style={styles.content}>
                    <Text style={styles.name}>{board.name}</Text>
                    {board.description ? (
                        <Text style={styles.description} numberOfLines={2}>
                            {board.description}
                        </Text>
                    ) : null}
                </View>
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
        height: 150,
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    thumbnail:
    {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay:
    {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 15,
        justifyContent: 'space-between',
    },
    content:
    {
        flex: 1,
        justifyContent: 'flex-end',
    },
    name:
    {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    description:
    {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    deleteButton:
    {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText:
    {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});
