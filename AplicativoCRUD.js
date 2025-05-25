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
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const URL_BASE = 'https://ca4fce58f062a7a9ad45.free.beeceptor.com/api/books';

const AplicativoCRUD = () => {
    const [listaItens, setListaItens] = useState([]);
    const [novoNome, setNovoNome] = useState('');
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [nomeAtualizado, setNomeAtualizado] = useState('');
    const [modalVisivel, setModalVisivel] = useState(false);

    useEffect(() => {
        buscarItens();
    }, []);
    const buscarItens = async () => {
        try {
            const resposta = await axios.get(`${URL_BASE}/itens`);
            console.log('Resposta da API:', resposta.data);
            setListaItens(resposta.data);
        } catch (erro) {
            console.error('Erro ao buscar itens:', erro);
        }
    };

    const adicionarItem = async () => {
        try {
            const novoItem = {
                id: Date.now(),
                name: novoNome
            };
            await axios.post(`${URL_BASE}/itens`, novoItem);
            buscarItens();
            setNovoNome('');
        } catch (erro) {
            console.error('Erro ao adicionar item:', erro);
        }
    };
    const abrirModalEdicao = (item) => {
        setItemSelecionado(item);
        setNomeAtualizado(item.name);
        setModalVisivel(true);
    };
    const editarItem = async () => {
        try {
            await axios.put(`${URL_BASE}/itens/${itemSelecionado.id}`, {
                id: itemSelecionado.id,
                name: nomeAtualizado,
            });
            buscarItens();
            setModalVisivel(false);
        } catch (erro) {
            console.error('Erro ao atualizar item:', erro);
        }
    };
    const removerItem = async (id) => {
        try {
            await axios.delete(`${URL_BASE}/itens/${id}`);
            buscarItens();
        } catch (erro) {
            console.error('Erro ao remover item:', erro);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Cadastrar Novo Item</Text>
            <TextInput
                placeholder="Digite o nome do item"
                value={novoNome}
                onChangeText={setNovoNome}
                style={styles.input}
            />
            <Button title="Adicionar" onPress={adicionarItem} />
            <Text style={styles.titulo}>Itens Cadastrados</Text>
            <FlatList
                data={listaItens}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemTexto}>{item.name}</Text>
                        <View style={styles.botoes}>
                            <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
                                <Icon name="edit" size={24} color="#007AFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removerItem(item.id)}
                                style={{ marginLeft: 15 }}>
                                <Icon name="delete" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <Modal visible={modalVisivel} animationType="slide" transparent>
                <View style={styles.modalFundo}>
                    <View style={styles.modalConteudo}>
                        <Text style={styles.titulo}>Editar Item</Text>
                        <TextInput
                            value={nomeAtualizado}
                            onChangeText={setNomeAtualizado}
                            style={styles.input}
                        />
                        <Button title="Salvar Alterações" onPress={editarItem} />
                        <View style={{ marginTop: 10 }}></View>
                        <Button title="Cancelar" color="gray" onPress={() =>
                            setModalVisivel(false)} />
                    </View>
                </View>
            </Modal >
        </View >
    );
};
export default AplicativoCRUD;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fff'
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#ccc',
    },
    temContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f2f2f2',
        marginVertical: 5,
        borderRadius: 5,
    },
    itemTexto: {
        fontSize: 16,
        flex: 1,
    },
    botoes: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalFundo: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalConteudo: {
        backgroundColor: '#fff',
        padding: 20,
        width: '90%',
        borderRadius: 10,
        elevation: 5,
    },
});
