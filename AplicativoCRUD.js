import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const URL_BASE = 'https://ca5b7ed680fb9fe62548.free.beeceptor.com/api';

const AplicativoCRUD = () => {
    const [listaItens, setListaItens] = useState([]);
    const [novoNome, setNovoNome] = useState('');
    const [novoAutor, setNovoAutor] = useState('');
    const [novoAno, setNovoAno] = useState('');
    const [novoGenero, setNovoGenero] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');

    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [modalVisivel, setModalVisivel] = useState(false);

    useEffect(() => {
        buscarItens();
    }, []);

    const buscarItens = async () => {
        try {
            const resposta = await axios.get(`${URL_BASE}/books`);
            setListaItens(resposta.data);
        } catch (erro) {
            console.error('Erro ao buscar itens:', erro);
        }
    };

    const adicionarItem = async () => {
        if (!novoNome || !novoAutor || !novoAno || !novoGenero || !novaDescricao) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            const novoItem = {
                id: Date.now(),
                name: novoNome,
                author: novoAutor,
                year: novoAno,
                genre: novoGenero,
                description: novaDescricao,
            };
            await axios.post(`${URL_BASE}/books`, novoItem);
            buscarItens();
            setNovoNome('');
            setNovoAutor('');
            setNovoAno('');
            setNovoGenero('');
            setNovaDescricao('');
        } catch (erro) {
            console.error('Erro ao adicionar item:', erro);
        }
    };

    const removerItem = async (id) => {
        try {
            await axios.delete(`${URL_BASE}/books/${id}`);
            buscarItens();
        } catch (erro) {
            console.error('Erro ao remover item:', erro);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Cadastrar Novo Livro</Text>
            <TextInput placeholder="Título" value={novoNome} onChangeText={setNovoNome} style={styles.input} />
            <TextInput placeholder="Autor" value={novoAutor} onChangeText={setNovoAutor} style={styles.input} />
            <TextInput placeholder="Ano" value={novoAno} onChangeText={setNovoAno} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Gênero" value={novoGenero} onChangeText={setNovoGenero} style={styles.input} />
            <TextInput placeholder="Descrição" value={novaDescricao} onChangeText={setNovaDescricao} style={styles.input} />
            <Button title="Adicionar" onPress={adicionarItem} />

            <Text style={styles.titulo}>Livros Cadastrados</Text>
            <FlatList
                data={listaItens}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemTexto}>{item.name} - {item.author} ({item.year})</Text>
                        <Text style={styles.itemTextoSec}>{item.genre} - {item.description}</Text>
                        <View style={styles.botoes}>                            
                            <TouchableOpacity onPress={() => removerItem(item.id)}>
                                <Icon name="delete" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default AplicativoCRUD;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginVertical: 5,
        borderRadius: 5,
        borderColor: '#ccc',
    },
    itemContainer: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        marginVertical: 5,
        borderRadius: 5,
    },
    itemTexto: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemTextoSec: {
        fontSize: 14,
        color: '#555',
    },
    botoes: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'flex-end',
    },
});
