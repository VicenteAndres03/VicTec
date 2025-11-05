package ViDev.Victec.service;

import ViDev.Victec.model.Direccion;
import ViDev.Victec.model.Usuario;
import ViDev.Victec.repository.DireccionRepository;
import ViDev.Victec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Direccion> getDireccionesByUsuarioId(Long usuarioId) {
        return direccionRepository.findByUsuarioId(usuarioId);
    }

    public Direccion addDireccion(Long usuarioId, Direccion direccion) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        direccion.setUsuario(usuario);
        return direccionRepository.save(direccion);
    }

    public void deleteDireccion(Long direccionId, Long usuarioId) {
        Direccion direccion = direccionRepository.findById(direccionId).orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
        if (!direccion.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tiene permiso para eliminar esta dirección");
        }
        direccionRepository.delete(direccion);
    }
}
